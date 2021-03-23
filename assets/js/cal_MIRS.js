function cal_MIRS () {
	
	//表达中位数
	var median1 = [0.006684466,-0.225560538,-0.373013582,-0.122164763,-0.0470983,-0.1246012,-0.3424729,-0.3321628,-0.1746495,-0.1514488,-0.1027198,-0.0602933]
	var median2 = [-0.10978599,-0.08752328,-0.16919150,-0.09432359,-0.15809367,-0.06900462,-0.23930974,-0.28481154,-0.23952909,-0.33661214,-0.29695813,-0.26220614]
	var median = []
	
	//风险值中位数
	var scoreM1 = 3.097
	var scoreM2 = 2.936
	var scoreM = 0
	
	var category = $("#category").val()
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
