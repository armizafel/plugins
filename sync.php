<?php
function get_file_path($path){
	global $listFiles;
	global $fileSupports;	
	try{
		if ($gestor = opendir($path)) { 
		    while (false !== ($entrada = readdir($gestor))) {	    	
		    	if ($entrada == '..' || $entrada == '.') {
		          continue;
		        }
		        
		        $file  = $path.$entrada;
		        if (is_dir($file)) { 
			        //si es directorio volver a entrar y buscar sus archivos
			    }else if(is_file($file)){
			    	if(array_search(pathinfo($file,PATHINFO_EXTENSION), $fileSupports) !== false){
			    		$fsize = filesize($file);
			    		$pInfo = pathinfo($file);
			    		$pInfo["filesize"] = $fsize;
			    		array_push($listFiles, $pInfo);		    	
			    	}
			    	
			    }
		    }  	 	
	    	closedir($gestor);    	
	    	return "1";
		}else{
			return "No se pudo abrir el directorio";
		}
	}catch(Exception $e){        
        return $e->getMessage();
    }
}

?>