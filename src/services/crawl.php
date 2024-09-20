<?php
/**
 * @author: BBMCode
 * @link: https://github.com/bbmcodedotcom/F1-racing-result
 */
// CLI: php crawl.php (contact bbmcode247@mail.com for detail)

require 'vendor/autoload.php';
$httpClient = new \GuzzleHttp\Client();

$url = 'https://www.formula1.com/en/results/jcr:content/resultsarchive.html/' . date("Y") . '/races.html';
$response = $httpClient->get($url);
$htmlString = (string) $response->getBody();
//add this line to suppress any warnings
libxml_use_internal_errors(true);

$doc = new DOMDocument();
$doc->loadHTML($htmlString);
$xpath = new DOMXPath($doc);
$options = $xpath->query('/html/body//select');
$years = [];
$dataList = [];
foreach ($options as $option) {
    $name =$option->getAttribute('name');
    $children = $option->childNodes;
    foreach ($children as $child) {
        if ($name == 'year' && trim($child->nodeValue) != '') {
            $years[] = $child->nodeValue;
        }
        /* if ($name == 'apiType' && trim($child->nodeValue) != '') {
            $apiTypes[] = $child->nodeValue;
        }
        if ($name == 'meetingKey' && trim($child->nodeValue) != '') {
            $keys[] = $child->nodeValue;
        } */
    }
}
// TODO: limit test
$limit = 99; // 99 years
$i = 1;
foreach ($years as $year) {
    $dataList += getDataByYear($year);
    sleep(1);
    if ($i > $limit) {
        break;
    }
    $i++;
}
$path = 'data.json';
$jsonString = json_encode($dataList, JSON_PRETTY_PRINT);
// Write in the file
$fp = fopen($path, 'w');
fwrite($fp, $jsonString);
fclose($fp);

function getDataByYear($year) {
    // get race all
    $result = [];
    $httpClient = new \GuzzleHttp\Client();
    $url = 'https://www.formula1.com/en/results/jcr:content/resultsarchive.html/' . $year . '/races.html';
    $response = $httpClient->get($url);
    $htmlString = (string) $response->getBody();

    $doc = new DOMDocument();
    $doc->loadHTML($htmlString);
    $xpath = new DOMXPath($doc);
    $options = $xpath->query('/html/body//select');

    $yearsApiTypes = [];
    foreach ($options as $option) {
        $name = $option->getAttribute('name');
        $children = $option->childNodes;
        foreach ($children as $child) {
            if ($name == 'apiType' && trim($child->nodeValue) != '') {
                $value = $child->getAttribute('value');
                $yearsApiTypes[$year][] = [
                    'name' => $child->nodeValue,
                    'key_url' => $value . '.html',
                    'type' => $value,
                    'data_type' => $value,
                    'values' => []
                ];
            }
        }
    }
    $result = [];
    foreach ($yearsApiTypes as &$dataTypes) {
        foreach ($dataTypes as &$data) {
            $urlHtml = $data['key_url'];
            $result = getBlockContentForAll($year, $urlHtml, $data['type']);
            $data['values']['all'] = $result['all'] ?? [];
            if (isset($result['others']) && count($result['others']) > 0) {
                foreach ($result['others'] as $key => &$v) {
                    $urlHtml = $v['key_url'];
                    $v['data_type'] = $data['data_type'];
                    $v['values'] = getBlockContentForSignle($year, $urlHtml);
                    $data['values'][$key] = $v;
                }
            }
        }
    }
    return $yearsApiTypes;
}

function getBlockContentForAll($year, $urlHtml, $type) {
    $httpClient = new \GuzzleHttp\Client();
    $url = 'https://www.formula1.com/en/results/jcr:content/resultsarchive.html/' . $year . '/' . $urlHtml;
    $response = $httpClient->get($url);
    $htmlString = (string) $response->getBody();

    $doc = new DOMDocument();
    $doc->loadHTML($htmlString);
    $xpath = new DOMXPath($doc);

    $list = [];
    $keys = [];
    foreach($xpath->query('//table[@class="resultsarchive-table"]/thead/tr/th') as $th)
    {
        $text = trim($th->nodeValue);
        if (!strlen($text)) {
            continue;
        }
        $key = str_replace(' ', '_', $text);
        $list[$key] = [];
        $keys[$key] = true;
    }
    $keys = array_keys($keys);
    $rows = $xpath->query('//table[@class="resultsarchive-table"]/tbody/tr');
    $result = [];
    $all = [];
    foreach ($rows as $k => $row) {
        $cells = $row->getElementsByTagName('td');
        $i = 0;
        $data = ['id' => $k+1];
        foreach ($cells as $k => $cell) {
            $value = trim($cell->nodeValue);
            $value = preg_replace('/\s+/', ' ', $value);

            if ($value == '') {
                continue;
            }
            $key = $keys[$i];
            $data[$key] = $value;
            $i++;
        }
        $all[] = $data;
    }
    $result['all'] = $all;

    // meetingKeys
    $options = $xpath->query('/html/body//select');
    foreach ($options as $option) {
        $name = $option->getAttribute('name');
        $children = $option->childNodes;
        foreach ($children as $child) {
            if ($name != 'year' && $name != 'apiType' && trim($child->nodeValue) != '') {
                $value = $child->getAttribute('value');
                if (trim($value) == '' || strtolower($value) == 'all') {
                    continue;
                }
                $key = str_replace(' ','_', trim($child->nodeValue));
                $result['others'][$key] = [
                    'name' => $child->nodeValue,
                    'key_url' => $type . '/' . $value . '.html',
                    'type' => $value,
                    'values' => []
                ];
            }
        }
    }

    return $result;
}
function getBlockContentForSignle($year, $urlHtml) {
    $httpClient = new \GuzzleHttp\Client();
    $url = 'https://www.formula1.com/en/results/jcr:content/resultsarchive.html/'.$year.'/' . $urlHtml;
    $response = $httpClient->get($url);
    $htmlString = (string) $response->getBody();

    $doc = new DOMDocument();
    $doc->loadHTML($htmlString);
    $xpath = new DOMXPath($doc);

    $list = [];
    $keys = [];
    foreach($xpath->query('//table[@class="resultsarchive-table"]/thead/tr/th') as $th)
    {
        $text = trim($th->nodeValue);
        if (!strlen($text)) {// ignore all
            continue;
        }
        $key = str_replace(' ', '_', $text);
        $list[$key] = [];
        $keys[$key] = true;
    }
    $keys = array_keys($keys);
    $rows = $xpath->query('//table[@class="resultsarchive-table"]/tbody/tr');
    $result = [];
    foreach ($rows as $k => $row) {
        $cells = $row->getElementsByTagName('td');
        $i = 0;
        $data = ['id' => $k+1];
        foreach ($cells as $cell) {
            $value = trim($cell->nodeValue);
            $value = preg_replace('/\s+/', ' ', $value);
            if ($value == '') {
                continue;
            }
            $key = $keys[$i];
            $data[$key] = $value;
            $i++;
        }
        $result[] = $data;
    }
    return $result;
}
