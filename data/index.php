<?php 
header('Content-Type: text/plain; charset=windows-1251');

$id = isset($_GET["_"])&&$_GET["_"]=="cd" ? "cd" : "ab";
define("_ID_", $id);
$mode = isset($_GET["$"])&&$_GET["$"]=="sbj" ? "sbj" : "li";

if($mode == "sbj"){
	if($id == "ab"){
		$subject = get("/subject.txt");
		$subject = explode("\n", $subject);
		$list = array();
		foreach($subject as $s){
			if($s){
				$s = explode("-", $s);
				$s[1] = explode(",", $s[1]);
				$list[] = $s;
			}
		}
	}else{
		$subject = get("/subjectCD.txt");
		$subject = explode("\n", $subject);
		$list = array();
		foreach($subject as $s){
			if($s){
				$list[] = $s;
			}
		}
	}
	if(count($subject) < 10)die("%404%");
	print_r(json_encode($list));
	die();
}
$test = array();
$list = ls("{$id}_text");
$image = ls("{$id}_image");
$difficult = get("/{$id}_difficult.txt");

if(count($list) < 2)die("%404%");

$images = array();
foreach($image as $i){
	$n = substr($i, 0, 2)-1;
	$m = substr($i, 2, 2)-1;
	if(!$test[$n])$test[$n] = array();
	
	$images[$n][$m] = "{$id}_image/{$i}";
}

foreach($list as $l){
	if(strlen($l) != 8){
		continue;
	}
	$n = (int)substr($l, 0, 2)-1;
	$m = (int)substr($l, 2, 2)-1;
	if(!$test[$n])$test[$n] = array();
	if($test[$n] === false)continue;
	
	$test[$n][$m] = parseTest(
		get("/{$id}_text/{$l}"), 
		$images[$n][$m], 
		$l
	);
}
foreach($test as $k => $v){
	$count = 0;
	foreach($v as $t){
		if($t){
			$count++;
		}
	}
	if($count < 20){
		unset($test[$k]);
	}
}
echo json_encode($test);

function parseTest($t, $img="", $id){
	global $difficult;
	if(strlen($t) < 10)return false;
	$question = "";
	$answers = array();
	$tip = "";
	$id = strtoupper(_ID_) . preg_replace("/[^0-9]/", "", $id);
	$diff = strpos($difficult, preg_replace("/[^0-9]/", "", $id)) !== false;
	
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
	return array(
		"question" => $question,
		"answers" => $answers,
		"tip" => $tip,
		"id" => $id,
		"image" => $img ? $img : "/blank.jpg",
		"difficult" => $diff
	);
}
function ls($dir){
	if(strlen($dir) < 2)die();
	@$dh = opendir(dirname(__FILE__)."/{$dir}/");
	$ls = array();
	while ($dh && false !== ($f = readdir($dh))) {
		if($f AND !is_dir($f)){
			$ls[] = $f;
		} 
	}
	sort($ls);
	return $ls;
}
function get($path){
	@$t = file_get_contents(dirname(__FILE__).$path)."";
	$t = str_replace("\r", "", $t);
	$t = mb_convert_encoding($t, "UTF-8", "windows-1251");
	return $t;
}