function cal_MIRS () {
	
	//表达中位数
	var median1 = [2.224046,1.854515,2.273722,2.260983,2.123211,1.999857,2.239337,2.070410,2.322982,2.598081,2.580452,2.516731]
	var median2 = [0.00000,0.00000,0.67765,0.00000,3.81380,0.64300,5.44680,2.01635,8.11905,27.98270,17.39995,15.69320]
	var median = []
	
	//风险值中位数
	var scoreM1 = 3.058
	var scoreM2 = 3.530
	var scoreM = 0
	
	//for normalization
	raw_mean1=[2.220909,1.925545,2.380201,2.273215,2.119904,2.011220,2.331778,2.159179,2.345725,2.608382,2.587671,2.510971]
	raw_mean2=[1.41031536363636,11.5772537272727,29.2589545454545,7.45179290909091,7.86003145454545,2.55718663636364,38.7689202727273,9.82588254545455,21.2980994545455,63.0954030909091,27.8366182727273,41.2490561818182]
	
	raw_sd1=[0.08570754,0.30230828,0.29731626,0.13890583,0.1882224,0.1316566,0.3258734,0.3200277,0.1991552,0.3664037,0.1940809,0.2448609]
	raw_sd2=[12.8460414820842,132.276274493099,168.928720959428,79.0024269064184,25.5938862924069,27.7399770068321,139.242638983029,27.4199999822995,55.0206627450076,104.312051777253,35.1452516413345,97.4647443126424]
	
		
	var normaliztion = $("#normalization").val()
	
	var category = $("#category").val()
	if (typeof(category) == 'undefined' ||  !category) {
			alert("Please select the expression profiling platform of your data!"); // 如果为空,提示选择
	}else{
		if(typeof(normaliztion) == 'undefined' ||  !normaliztion){
			alert("Please select the normalization method of your data!"); // 如果为空,提示选择
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
				//alert("expression list is: "+expression);
				
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
						
						var coef = [0.36921337,0.34025946,0.88848019,0.23721521,0.58001387,0.06024269,0.65622061,0.35781187,0.71484387,0.56060845,0.47687328,0.74309993]
						var exp = []
						
						// for dangerous genes
						for(var i = 0, len = 4; i < len; i++){
							if(expression[i] - median[i] > 0){
								exp[i] = 1
							}else{
								exp[i] = 0
							}
						}
						
						// for protective genes
						for(var i = 4, len = 12; i < len; i++){
							if(expression[i] - median[i] > 0){
								exp[i] = 0
							}else{
								exp[i] = 1
							}
						}
						
						var score = 0 ;
						for(var i = 0, len = 12; i < len; i++){
							//alert("current score is: "+score);
							//alert("current exp is "+exp[i]+", current coef is "+coef[i]+", current node score is exp x coef is "+exp[i]*coef[i]);
							score = score + exp[i]*coef[i];
						}
						
						score = score.toPrecision(4)
						
						phrase = "<h2> This is currently for research purpose only !</h2>"
						phrase = phrase + '<h4><img src="images/03.Nomogram.TCGA2.png" alt="" height="60" width="60"/></h4>'
						phrase = phrase + '<h4> MIRS = <strong>' + score + ', Median MIRS score in our research is: <strong>' + scoreM + '</strong></h4>' ;
					
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
	demo1="2.135472\r\n1.662320\r\n2.198080\r\n2.181625\r\n2.015810\r\n1.836213\r\n2.505985\r\n2.144239\r\n2.426775\r\n2.865850\r\n2.678483\r\n2.602823"

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

function bindCategory(){
	
	var category = $("#category").val();
	var normalization = $("#normalization").val();
	
	//清空下拉框选项
	$("#normalization").empty();
	
	if(category == "Microarray"){
		var phrase = "";
		phrase = '<option value="">- Which normalization method did you choose for your data? -</option>';
		phrase = phrase + '<option value="Yes">Z-score based on raw expression values</option>';
		phrase = phrase + '<option value="No">log2(RMA-based value + 1)</option>';
		$('#normalization').html(phrase);
		
	}else if(category == "NGS"){
		var phrase = "";
		phrase = '<option value="">- Which normalization method did you choose for your data? -</option>';
		phrase = phrase + '<option value="Yes">Z-score based on raw expression values</option>';
		phrase = phrase + '<option value="No">log2(FPKM+1)</option>';
		$('#normalization').html(phrase);
		
	}
	
}













