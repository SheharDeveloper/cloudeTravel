(function($) {
	
	var dzChartlist = function(){
	
		var screenWidth = $(window).width();
		
		var chartBar = function(){
			var options = {
				series: [
					{
						name: 'Week',
						data: [50, 90, 90,50],
					}, 
					{
						name: 'Month',
						data: [80, 40, 55,40]
					},
				],
				chart: {
					type: 'bar',
					height: 120,
					toolbar: {
						show: false,
					},
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '80%',
						endingShape: "rounded",
						borderRadius: 8,
					},
				},
				states: {
					hover: {
						filter: 'none',
					}
				},
				colors:[
					'var(--bs-primary)',
					'var(--bs-warning)',
				],
				dataLabels: {
					enabled: false,
					offsetY: -30
				},
				legend: {
					show: false,
					fontSize: '12px',
					labels: {
						colors: 'var(--bs-body-color)',
					},
					markers: {
						width: 15,
						height: 18,
						strokeWidth: 5,
						strokeColor: '#fff',
						fillColors: undefined,
						radius: 12,	
					}
				},
				stroke: {
					show: true,
					width:14,
					curve: 'smooth',
					lineCap: 'round',
					colors: ['transparent']
				},
				grid: {
					show: false,
					xaxis: {
						lines: {
							show: false,
						}
					},
					yaxis: {
						lines: {
							show: false
						}
					},  				
				},
				xaxis: {
					categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY'],
					labels: {
						show: false,
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '14px',
							fontWeight: '500',
							fontFamily: 'poppins',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					crosshairs: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false,
					}, 			
				},
				yaxis: {
					labels: {
					show: false,
						offsetX:-16,
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '13px',
							fontFamily: 'poppins',
							fontWeight: 100,
							cssClass: 'apexcharts-xaxis-label',
						},
					},
				},
			};

			var chartBar1 = new ApexCharts(document.querySelector("#chartBar"), options);
			chartBar1.render();
		}
		
		var NewCustomers = function(){
			var options = {
			  series: [
					{
						name: 'Month',
						data: [100,300, 200, 250, 200, 240, 180,230,200, 250, 300],
						/* radius: 30,	 */
					}, 				
				],
				chart: {
					type: 'area',
					height: 100,
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
					sparkline: {
						enabled: true
					}
				},
			
				colors:['var(--bs-primary)'],
				dataLabels: {
					enabled: false,
				},

				legend: {
					show: false,
				},
				stroke: {
					show: true,
					width: 3,
					curve:'smooth',
					colors:['var(--bs-primary)'],
				},
			
				grid: {
					show:false,
					borderColor: '#eee',
					padding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: -1

					}
				},
				states: {
					normal: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					hover: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					active: {
						allowMultipleDataPointsSelection: false,
						filter: {
							type: 'none',
							value: 0
						}
					}
				},
				xaxis: {
					categories: ['Jan', 'feb', 'Mar', 'Apr', 'May', 'June', 'July','August', 'Sept','Oct'],
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false
					},
					labels: {
						show: false,
						style: {
							fontSize: '12px',
						}
					},
					crosshairs: {
						show: false,
						position: 'front',
						stroke: {
							width: 1,
							dashArray: 3
						}
					},
					tooltip: {
						enabled: true,
						formatter: undefined,
						offsetY: 0,
						style: {
							fontSize: '12px',
						}
					}
				},
				yaxis: {
					show: false,
				},
				fill: {
					  opacity: 0.9,
					  colors:'var(--bs-primary)',
					type: 'gradient', 
					gradient: {
						colorStops:[ 
							{
								offset: 0,
								color: 'var(--bs-primary)',
								opacity: .8
							},
							{
								offset: 0.6,
								color: 'var(--bs-primary)',
								opacity: .6
							},
							{
								offset: 100,
								color: 'white',
								opacity: 0
							}
						], 
					}
				},
				tooltip: {
					enabled:false,
					style: {
						fontSize: '12px',
					},
					y: {
						formatter: function(val) {
							return "$" + val + " thousands"
						}
					}
				}
			};

			var chartBar1 = new ApexCharts(document.querySelector("#NewCustomers"), options);
			chartBar1.render();
		}

		var Active = function(){
			var options = {
				series: [
					{
						name: 'Net Profit',
						data: [100,400, 200, 250, 200, 150, 180,230,200, 250, 300],
					}, 				
				],
				chart: {
					type: 'area',
					height: 100,
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
					sparkline: {
						enabled: true
					}
				},
				colors:['var(--bs-warning)'],
				dataLabels: {
				  enabled: false,
				},
				legend: {
					show: false,
				},
				stroke: {
					show: true,
					width: 3,
					curve:'smooth',
					colors:['var(--bs-warning)'],
				},
			
				grid: {
					show:false,
					borderColor: '#eee',
					padding: {
						top: 0,
						right: 0,
						bottom: 0,
						left: -1
					}
				},
				states: {
					normal: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					hover: {
						filter: {
							type: 'none',
							value: 0
						}
					},
					active: {
						allowMultipleDataPointsSelection: false,
						filter: {
							type: 'none',
							value: 0
						}
					}
				},
				xaxis: {
					categories: ['Jan', 'feb', 'Mar', 'Apr', 'May', 'June', 'July','August', 'Sept','Oct'],
					axisBorder: {
						show: false,
					},
					axisTicks: {
						show: false
					},
					labels: {
						show: false,
						style: {
							fontSize: '12px',
						}
					},
					crosshairs: {
						show: false,
						position: 'front',
						stroke: {
							width: 1,
							dashArray: 3
						}
					},
					tooltip: {
						enabled: true,
						formatter: undefined,
						offsetY: 0,
						style: {
							fontSize: '12px',
						}
					}
				},
				yaxis: {
					show: false,
				},
				fill: {
					opacity: 0.9,
					colors:'var(--bs-warning)',
					type: 'gradient', 
					gradient: {
						colorStops:[
							{
								offset: 0,
								color: 'var(--bs-warning)',
								opacity: .8
							},
							{
								offset: 0.6,
								color: 'var(--bs-warning)',
								opacity: .6
							},
							{
								offset: 100,
								color: 'white',
								opacity: 0
							}
						],
					}
				},
				tooltip: {
					enabled:false,
					style: {
						fontSize: '12px',
					},
					y: {
						formatter: function(val) {
							return "$" + val + " thousands"
						}
					}
				}
			};

			var chartBar1 = new ApexCharts(document.querySelector("#Active"), options);
			chartBar1.render();
		}

		var activityChart = function(){
			var optionsTimeline = {
				chart: {
					type: "bar",
					height: 230,
					stacked: true,
					toolbar: {
						show: false
					},
					sparkline: {
						//enabled: true
					},
					offsetX:0,
				},
				series: [
					 {
						name: "New Clients",
						data: [180, 150, 200, 100, 150, 180, 150,170,115,190,140,80,70,90,120,50,90,100,200,300,180,200,150]
					}
				],
				
				plotOptions: {
					bar: {
						columnWidth: "25%",
						endingShape: "rounded",
						startingShape: "rounded",
						 borderRadius: 5,
						
						colors: {
							backgroundBarColors: ['#F8F8F8', '#F8F8F8', '#F8F8F8', '#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8','#F8F8F8'],
							backgroundBarOpacity: 1,
							backgroundBarRadius: 5,
						},
					},
					distributed: true
				},
				colors:['var(--bs-primary)'],
				grid: {
					show:false,
					borderColor:'#F8F8F8'
				},
				legend: {
					show: false
				},
				fill: {
				  opacity: 1
				},
				dataLabels: {
					enabled: false,
					colors: ['#000'],
					dropShadow: {
						enabled: true,
						top: 1,
						left: 1,
						blur: 1,
						opacity: 1
					}
				},
				xaxis: {
					categories: ['S', 'M', 'T', 'W', 'T', 'F', 'S','S','M','T','W','T','F','S','M','T','W','T','F','S','M','T','W'],
					labels: {
						style: {
							colors: '#787878',
							fontSize: '13px',
							fontFamily: 'poppins',
							fontWeight: 400,
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					crosshairs: {
						show: false,
					},
					axisBorder: {
						show: false,
					},
				},
				
				yaxis: {
					show: false
				},
				
				tooltip: {
					x: {
						show: true
					}
				}
			};
			var chartTimelineRender =  new ApexCharts(document.querySelector("#activityChart"), optionsTimeline);
			chartTimelineRender.render();	
		}
		
		var handleProjectsTable = function(){
			if(jQuery('#projects-tbl').length > 0){
				var table = $('#projects-tbl').DataTable({
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
						var btns = $('#projects-tbl_wrapper .dt-buttons').detach();
						$('#tableTransactionExcelBTN').append(btns);
					}		
				});
			}
		}
	
 
		/* Function ============ */
		return {
			init:function(){
				
			},
			
			
			load:function(){
				chartBar();
				NewCustomers();
				Active();
				activityChart();
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