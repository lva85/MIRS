function cal_MIRS () {
	
	//表达中位数
	var median1 = [0.006684466,-0.225560538,-0.373013582,-0.122164763,-0.0470983,-0.1246012,-0.3424729,-0.3321628,-0.1746495,-0.1514488,-0.1027198,-0.0602933]
	var median2 = [-0.10978599,-0.08752328,-0.16919150,-0.09432359,-0.15809367,-0.06900462,-0.23930974,-0.28481154,-0.23952909,-0.33661214,-0.29695813,-0.26220614]
	var median = []
	
	//风险值中位数
	var scoreM1 = 3.097
	var scoreM2 = 2.936
	var scoreM = 0
	
	//for normalization
	raw_mean1=[3.342204566,2.91324841,4.331677921,3.430218866,3.007579138,4.174230421,3.587500858,3.048631765,4.132990426,5.234183029,5.066023653,4.189620213]
	raw_mean2=[1.41031536363636,11.5772537272727,29.2589545454545,7.45179290909091,7.86003145454545,2.55718663636364,38.7689202727273,9.82588254545455,21.2980994545455,63.0954030909091,27.8366182727273,41.2490561818182]
	
	raw_sd1=[0.214830179,1.316479881,1.329676573,0.682528539,0.3981494,1.321066509,1.166408167,0.393477465,0.740548389,1.594295664,0.825091052,0.571294473]
	raw_sd2=[12.8460414820842,132.276274493099,168.928720959428,79.0024269064184,25.5938862924069,27.7399770068321,139.242638983029,27.4199999822995,55.0206627450076,104.312051777253,35.1452516413345,97.4647443126424]
	
		
	var normaliztion = $("#normalization").val()
	
	var category = $("#category").val()
	if(typeof(normaliztion) == 'undefined' ||  !normaliztion){
			alert("Please select whether your data have been normalized!"); // 如果为空,提示选择
	}else{
		if (typeof(category) == 'undefined' ||  !category) {
			alert("Please select the category of your data!"); // 如果为空,提示选择
		}else{
			
			if(category == "Microarray"){
				median = median1
				scoreM = scoreM1
			}else if(category == "NGS"){
				median = median2
				scoreM = scoreM2
			}
			
			if(normaliztion == "No"){
				if(category == "Microarray"){
					raw_mean = raw_mean1
					raw_sd = raw_sd1
				}else if(category == "NGS"){
					raw_mean = raw_mean2
					raw_sd = raw_sd2
				}
			}
			
		
			var expression = $("#expression").val();
			if(typeof(expression) == 'undefined' ||  !expression){
				alert("Please paste the expression of 12 panel genes !");
			}else{
				expression = expression.split("\n");
				
				if(expression.length < 12){
					alert("Please input the expression of whole panel genes !");
				}else{
					
					var flag = 1
					var re = /^[+-]?\d+(\.\d+)?$/
					for(var i = 0, len = 12; i < len; i++){
						if( !expression[i] || !re.test(Number(expression[i]))){
							flag = 0 ;
							break ;
						}
					}
					
					if(flag){
						if(normaliztion == "No"){
							for(var i = 0, len = 12; i < len; i++){
								expression[i] = (expression[i] - raw_mean[i])/raw_sd[i] 
							}
						}
						
						var coef = [0.470284969,0.55854255,0.44674328,0.563749135,0.359674811,0.501299441,0.178244084,0.773328662,0.699986398,0.638285995,0.623419881,0.418979287]
						var exp = []
					
						for(var i = 0, len = 12; i < len; i++){
							if(expression[i] - median[i] > 0){
								exp[i] = 1
							}else{
								exp[i] = 0
							}
						}
					
						var score = 0 ;
						for(var i = 0, len = 12; i < len; i++){
							score = score + exp[i]*coef[i];
						}
						score = score.toPrecision(4)
						
						phrase = "<h2> This is currently for research purpose only !</h2>"
						phrase = phrase + '<h4> MIRS = <strong>' + score + ', Median MIRS of the analyzed data: <strong>' + scoreM + '</strong></h4>' ;
					
						if (score - scoreM > 0){
							phrase = phrase + '<h4><strong>High MIRS</strong> might be benefit from the Chemotherapy:</h4>' ;
							phrase = phrase + '<h4>Chemotherapy drug information: <strong>Imatinib, Cisplatin, Gemcitabine</strong></h4>' ;
							phrase = phrase + '<img src="images/drug_info1.png" alt="" height="60" width="60"/>  <img src="images/drug_info2.png" alt="" height="60" width="60"/>'
						} else if (score - scoreM < 0){
							phrase = phrase + '<h4><strong>LOW MIRS</strong> may benefit from the Immunotherapy.</h4>'
						}
						
					
						$('#result').children('div').children('div').children('div').children('h4').html(phrase);
					}else{
						alert("Please input numeric content !");
					}
				}
			}
		}
	}
}


function try_demo(x){
	demo1="0.634205893\r\n-0.424184538\r\n-0.466141115\r\n0.397536686\r\n0.291720968\r\n-1.06862479\r\n-0.441542569\r\n2.686533101\r\n1.124605206\r\n1.807808009\r\n1.947472759\r\n2.293771161"

	demo2="0.001470074\r\n-0.087523282\r\n-0.17320296\r\n-0.094323595\r\n-0.25126436\r\n-0.092184166\r\n-0.260464902\r\n-0.358347285\r\n-0.302671735\r\n-0.556917462\r\n-0.527716189\r\n-0.382894927"
	
	var normalization = document.getElementById("normalization");
	normalization.options[1].selected = true;

	var category = document.getElementById("category");
	category.options[x].selected = true;
	
	var expression = document.getElementById("expression");
	if(x == 1){
		expression.value = demo1;
	}else if(x == 2){
		expression.value = demo2;
	}
}















