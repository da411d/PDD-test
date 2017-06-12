<?php 
header('Content-Type: text/plain; charset=windows-1251');

$id = isset($_GET["_"])&&$_GET["_"]=="cd" ? "cd" : "ab";

$test = [];
$list = ls("{$id}_text");
$image = ls("{$id}_image");
$difficult = file_get_contents(dirname(__FILE__)."/{$id}_difficult.txt");

if(count($list) < 2)die("%404%");

$images = [];
foreach($image as $i){
	$n = substr($i, 0, 2)-1;
	$m = substr($i, 2, 2)-1;
	if(!$test[$n])$test[$n] = [];
	
	$images[$n][$m] = "{$id}_image/{$i}";
}

foreach($list as $l){
	$n = substr($l, 0, 2)-1;
	$m = substr($l, 2, 2)-1;
	if(!$test[$n])$test[$n] = [];
	
	$test[$n][$m] = parseTest(
		file_get_contents(dirname(__FILE__)."/{$id}_text/{$l}"), 
		$images[$n][$m], 
		$l
	);
}
echo json_encode($test);

function parseTest($t, $img="", $id){
	global $difficult;
	$question = "";
	$answers = [];
	$tip = "";
	$id = preg_replace("/[^0-9]/", "", $id);
	$diff = strpos($difficult, $id) !== false;
	
	$t = mb_convert_encoding($t, "UTF-8", "windows-1251");
	$t = str_replace("\r", "", $t);
	$t = explode("\n", $t);
	$state = 0;
	foreach($t as $line){
		if( !(int)$line[0] && !count($answers)){
			$question .= $line;
		}else if( (int)$line[0] ){
			$answers[] = $line;
		}else{
			$tip .= $line;
		}
	}
	return [
		"question" => $question,
		"answers" => $answers,
		"tip" => $tip,
		"image" => $img ? $img : "/blank.jpg",
		"difficult" => $diff
	];
}
function ls($dir){
	if(strlen($dir) < 2)die();
	@$dh = opendir(dirname(__FILE__)."/{$dir}/");
	$ls = [];
	while ($dh && false !== ($f = readdir($dh))) {
		if($f AND !is_dir($f)){
			$ls[] = $f;
		} 
	}
	sort($ls);
	return $ls;
}