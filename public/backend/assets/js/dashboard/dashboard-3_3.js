(function($) {
	var dzChartlist = function(){
	
		var screenWidth = $(window).width();
	
		var redial = function(){
			var options = {
				series: [75],
				chart: {
					type: 'radialBar',
					offsetY: 0,
					height:200,
					sparkline: {
						enabled: true
					}
				},
				plotOptions: {
					radialBar: {
						startAngle: -180,
						endAngle: 180,
						track: {
							background: "rgba(var(--bs-primary-rgb), 0.1)",
							strokeWidth: '100%',
							margin: 3,
						},
						hollow: {
							margin: 20,
							size: '60%',
							background: 'transparent',
							image: undefined,
							imageOffsetX: 0,
							imageOffsetY: 0,
							position: 'front',
						},
						dataLabels: {
							name: {
								show: false
							},
							value: {
								offsetY: 5,
								fontSize: '16px',
								color:' var(--bs-heading-color)',
								fontWeight: 600,
							}
						}
					}
				},
				responsive: [{
					breakpoint: 1600,
					options: {
						chart: {
							height:150
						},
					}
				}],
				grid: {
					padding: {
						top: -10
					}
				},
			  
				fill: {
					type: 'gradient',
					colors:'var(--bs-secondary)',
					gradient: {
						shade: 'black',
						shadeIntensity: 0.15,
						inverseColors: false,
						opacityFrom: 1,
						opacityTo: 1,
						stops: [64, 43, 64, 0.5]
					},
				},
				labels: ['Average Results'],
			};

			var chart = new ApexCharts(document.querySelector("#redial"), options);
			chart.render();
		}
		
		var overiewChart = function(){
			if(jQuery("#overiewChart").length>0) {
				var options = {
					series: [
						{
							name: 'Number of Projects',
							type: 'column',
							data: [75, 85, 72, 100, 50, 100, 80, 75, 95, 35, 75,100]
						},
						{
							name: 'Revenue',
							type: 'area',
							data: [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50,42]
						},
						{
							name: 'Active Projects',
							type: 'line',
							data: [30, 25, 45, 30, 25, 35, 20, 45, 35, 20, 35,20]
						}
					],
					chart: {
						height: 350,
						type: 'line',
						stacked: false,
						toolbar: {
							show: false,
						},
					},
					grid: {
						borderColor: 'var(--bs-border-color)',
					},
					stroke: {
						width: [0, 1, 1],
						curve: 'straight',
						dashArray: [0, 0, 5],
						color: 'var(--bs-border-color)',
					},
					legend: {
						fontSize: '13px',
						fontFamily: 'poppins',
						labels: {
							colors: 'var(--bs-body-color)',
						}
					},
					plotOptions: {
						bar: {
							columnWidth: '18%',
							borderRadius: 6,
						}
					},
					fill: {
						type : 'gradient',
						gradient: {
							inverseColors: false,
							shade: 'light',
							type: "vertical",
							colorStops : [[
								{
									offset: 0,
									color: 'var(--bs-primary)',
									opacity: 1
								},{
									offset: 100,
									color: 'var(--bs-primary)',
									opacity: 1
								}],
								[{
									offset: 0,
									color: '#3AC977',
									opacity: 1
								},{
									offset: 0.4,
									color: '#3AC977',
									opacity: .15
								},{
									offset: 100,
									color: '#3AC977',
									opacity: 0
								}],
								[{
									offset: 0,
									color: '#FF5E5E',
									opacity: 1
								},{
									offset: 100,
									color: '#FF5E5E',
									opacity: 1
								}],
							],
							stops: [0, 100, 100, 100]
						}
					},
					colors:[
						"var(--bs-primary)", "var(--bs-success)", "var(--bs-danger)"
					],
					labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					markers: {
						size: 0
					},
					xaxis: {
						type: 'month',
						labels: {
							style: {
							   fontSize: '13px',
							   colors: 'var(--bs-body-color)',
							},
						},
					},
					yaxis: {
						min: 0,
						tickAmount: 4,
						labels: {
							style: {
								fontSize: '13px',
								colors: 'var(--bs-body-color)',
							},
						},
					},
					tooltip: {
						shared: true,
						intersect: false,
						y: {
							formatter: function (y) {
								if (typeof y !== "undefined") {
									return y.toFixed(0) + " points";
								}
								return y;
							}
						}
					}
				};

				var chart = new ApexCharts(document.querySelector("#overiewChart"), options);
				chart.render();
				
				$(".mix-chart-tab .nav-link").on('click',function(){
					var seriesType = $(this).attr('data-series');
					var columnData = [];
					var areaData = [];
					var lineData = [];
					switch(seriesType) {
						case "week":
							columnData = [75, 85, 72, 100, 50, 100, 80, 75, 95, 35, 75,100];
							areaData = [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50,42];
							lineData = [30, 25, 45, 30, 25, 35, 20, 45, 35, 20, 35,20];
							break;
						case "month":
							columnData = [20, 50, 80, 52, 10, 80, 50, 30, 95, 10, 60,85];
							areaData = [40, 25, 85, 45, 85, 25, 95, 65, 45, 45, 20,12];
							lineData = [65, 45, 25, 65, 45, 25, 75, 35, 65, 75, 15,65];
							
							break;
						case "year":
							columnData = [30, 20, 80, 52, 10, 90, 50, 30, 95, 20, 60,85];
							areaData = [40, 25, 40, 45, 85, 25, 50, 65, 45, 60, 20,12];
							lineData = [65, 45, 30, 65, 45, 25, 75, 40, 65, 50, 15,65];
							break;
						case "all":
							columnData = [20, 50, 80, 60, 10, 80, 50, 40, 95, 20, 60,85];
							areaData = [40, 25, 30, 45, 85, 25, 95, 65, 50, 45, 20,12];
							lineData = [65, 45, 25, 65, 45, 25, 30, 35, 65, 75, 15,65];
							break;
						default:
							columnData = [75, 80, 72, 100, 50, 100, 80, 30, 95, 35, 75,100];
							areaData = [44, 65, 55, 75, 45, 55, 40, 60, 75, 45, 50,42];
							lineData = [30, 25, 45, 30, 25, 35, 20, 45, 35, 30, 35,20];
					}
					chart.updateSeries([
						{
							name: "Number of Projects",
							type: 'column',
							data: columnData
						},{
							name: 'Revenue',
							type: 'area',
							data: areaData
						},{
							name: 'Active Projects',
							type: 'line',
							data: lineData
						}
					]);
				})
			}
		}

		var handleProjectsTable = function(){
			
			if(jQuery('#projectsTable').length > 0){
				var table = $('#projectsTable').DataTable({
					'dom': 'ZBfrltip',
					buttons: [{
						extend: 'excel',
						text: '<i class="fa-solid fa-file-excel"></i> Export Report',
						className: 'btn btn-primary light btn-sm'
					}],
					searching: false,
					pageLength:5,
					select: false,            
					lengthChange:false ,
					language: {
						paginate: {
							next: '<i class="fa-solid fa-angle-right"></i>',
							previous: '<i class="fa-solid fa-angle-left"></i>' 
						}			
					},
					initComplete: function() {
						var btns = $('#projectsTable_wrapper .dt-buttons').detach();
						$('#tableProjectsExcelBTN').append(btns);
					}		
				});
			}
			
			if(jQuery('#projectsTable1').length > 0){
				var table = $('#projectsTable1').DataTable({
					'dom': 'ZBfrltip',
					buttons: [{
						extend: 'excel',
						text: '<i class="fa-solid fa-file-excel"></i> Export Report',
						className: 'btn btn-primary light btn-sm'
					}],
					searching: false,
					pageLength: 6,
					select: false,            
					lengthChange:false ,
					language: {
						paginate: {
							next: '<i class="fa-solid fa-angle-right"></i>',
							previous: '<i class="fa-solid fa-angle-left"></i>' 
						}			
					},
					initComplete: function() {
						var btns = $('#projectsTable1_wrapper .dt-buttons').detach();
						$('#tableProjectsExcelBTN1').append(btns);
					}		
				});
			}
		}
	
		/* Function ============ */
		return {
			init:function(){
			
			},
			
			load:function(){
				redial();
				overiewChart();
				handleProjectsTable();
			},
			
			resize:function(){
			
			}
		}
	
	}();

	jQuery(window).on('load',function(){
		setTimeout(function(){
			dzChartlist.load();
		}, 1000); 
		
	});
	
})(jQuery);