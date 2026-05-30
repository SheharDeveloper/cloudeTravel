(function($) {
	
	var dzChartlist = function(){
		
		var screenWidth = $(window).width();
	
		var columnChart = function(){
			var options = {
				series: [{
					name: 'Sent',
					data: [40, 55, 15,40]
				}, {
					name: 'Answered',
					data: [55, 55, 35,60]
				}, {
					name: 'Hired',
					data: [20, 17, 55, 45]
				}],
				chart: {
					type: 'bar',
					height: 150,
					stacked: true,
					toolbar: {
						show: false,
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '30%',
						endingShape: "rounded",
						startingShape: "rounded",
						backgroundRadius: 10,
						colors: {
							backgroundBarColor: 'var(--bs-body-bg)',
							backgroundBarOpacity: 1,
							backgroundBarRadius: 10,
						},
					},
				},
				stroke:{
					width: 3,
					colors:["var(--bs-body-bg)"]
				},
				colors:['var(--bs-info)', 'var(--bs-warning)', 'var(--bs-primary)'],
				xaxis: {
					show: false,
					axisBorder: {
						show: false,
					},
					labels: {
						show: false,	
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 'light',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					axisTicks: {
						show: false,
					},
					crosshairs: {
						show: false,
					},
				},
				yaxis: {
					show: false,
					labels: {
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 'light',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
				},
				grid: {
					show: false,
					borderColor: 'var(--bs-border-color)',
					strokeDashArray: 10,
					position: 'back',
					padding: { top: 0, bottom: 0, left: 0, right: 0 },
					xaxis: {
						lines: {
							show: false
						}
					},   
					yaxis: {
						lines: {
							show: true
						}
					},  
				},
				toolbar: {
					enabled: false,
				},
				dataLabels: {
				  enabled: false
				},
				legend: {
					show:false
				},
				fill: {
					opacity: 1
				},
				responsive: [{
					breakpoint: 1601,
					options: {
						plotOptions: {
							bar: {
								columnWidth: '45%',
							},
							
						},
					},
				}]
			};

			var chart = new ApexCharts(document.querySelector("#columnChart"), options);
			chart.render();
		}
		
		var AllProject = function(){
			var options = {
				series: [12, 30, 20],
				chart: {
					type: 'donut',
					width: 180,
				},
				plotOptions: {
					pie: {
						donut: {
							size: '80%',
							labels: {
								show: true,
								name: {
									show: true,
									offsetY: 12,
								},
								value: {
									show: true,
									fontSize: '22px',
									color: 'var(--bs-heading-color)',
									fontFamily:'var(--bs-body-font-family)',
									fontWeight:'500',
									offsetY: -17,
								},
								total: {
									show: true,
									fontSize: '11px',
									fontWeight:'500',
									color: 'var(--bs-body-color)',
									fontFamily:'var(--bs-body-font-family)',
									label: 'Compete',
								   
									formatter: function (w) {
										return w.globals.seriesTotals.reduce((a, b) => {
											return a + b
										}, 0)
									}
								}
							}
						}
					}
				},
				stroke: {
					show: true,
					width: 2,
					colors: ['var(--bs-body-bg)'],
				},
				legend: {
					show: false,
				},
				colors: ['var(--bs-info)', 'var(--bs-primary)', 'var(--bs-warning)'],
				labels: ["Compete", "Pending", "Not Start"],
				dataLabels: {
					enabled: false,
				},
			};
			var chartBar1 = new ApexCharts(document.querySelector("#AllProject"), options);
			chartBar1.render();
		}
	
		var Traffic = function(){
			var options = {
				series: [12, 30, 20, 40,20],
				chart: {
					type: 'donut',
					width: 270,
				},
				plotOptions: {
					pie: {
						donut: {
							size: '80%',
							labels: {
								show: true,
								name: {
									show: true,
									offsetY: 12,
								},
								value: {
									show: true,
									color: 'var(--bs-heading-color)',
									fontSize: '22px',
									fontFamily: 'var(--bs-body-font-family)',
									fontWeight:'500',
									offsetY: -17,
								},
								total: {
									show: true,
									fontSize: '11px',
									color: 'var(--bs-body-color)',
									fontWeight:'500',
									fontFamily: 'var(--bs-body-font-family)',
									label: 'SCSS',
								   
									formatter: function (w) {
										return w.globals.seriesTotals.reduce((a, b) => {
											return a + b
										}, 0)
									}
								}
							}
						}
					}
				},
				stroke: {
					show: true,
					width: 2,
					colors: ['var(--bs-body-bg)'],
				},
				legend: {
					show: false,
				},
				colors: ['var(--bs-danger)','var(--bs-primary)', 'var(--bs-info)', 'var(--bs-success)','var(--bs-warning)'],
				labels: ["Html", "CSS", "SCSS","C++","JavaScript"],
				dataLabels: {
					enabled: false,
				},
			};
			var chartBar1 = new ApexCharts(document.querySelector("#Traffic"), options);
			chartBar1.render();
		}
		
		var ProjectChart = function(){
			var p = ["Html", "UI", "JS", "PHP", "CSS"];
			var options = {
				series: [
					{
						data: [
							{
								x: 'James',
								y: [
									new Date('2019-02-27').getTime(),
									new Date('2019-03-04').getTime()
								],
								fillColor: 'var(--bs-primary)'
							},
							{
								x: 'Robert',
								y: [
									new Date('2019-03-04').getTime(),
									new Date('2019-03-08').getTime()
								],
								fillColor: 'var(--bs-warning)'
							},
							{
								x: 'Mary',
								y: [
									new Date('2019-03-07').getTime(),
									new Date('2019-03-10').getTime()
								],
								fillColor: '#3a9b94'
							},
							{
								x: 'Patricia',
								y: [
									new Date('2019-03-08').getTime(),
									new Date('2019-03-12').getTime()
								],
								fillColor: '#666cff'
							},
							{
								x: 'Smith',
								y: [
									new Date('2019-03-12').getTime(),
									new Date('2019-03-17').getTime()
								],
								fillColor: '#FF4560'
							}
						]
					}
				],
				chart: {
				height: 260,
				type: 'rangeBar',
				parentHeightOffset: 0,
					toolbar: {
					   show: false,
					}
				},
				plotOptions: {
					bar: {
						horizontal: !0,
						distributed: !0,
						dataLabels: {
							hideOverflowingLabels: !1
						}
					}
				},
				dataLabels: {
					enabled: true,
					formatter: function(val, opts) {
						var label = opts.w.globals.labels[opts.dataPointIndex];
						var a = 10;
						var b = 20;
						var diff = 5;
						return label + ': ' + diff + (diff > 1 ? ' days' : ' day');
					},
					style: {
						colors: ['#f3f4f5', '#fff'],
					},
				},
				xaxis: {
					type: 'datetime',
					axisTicks: {
						show: !1
					},
					axisBorder: {
						show: !1
					},
					labels: {
						style: {
							colors: 'var(--bs-body-color)'
						},
						datetimeFormatter: {
							year: "MMM",
							month: "MMM"
						}
					}
				},
				yaxis: {
					labels: {
						show: !0,
						align: "left",
						style: {
							fontSize: "0.875rem",
							colors: 'var(--bs-body-color)'
						}
					}
				},
				grid: {
					strokeDashArray: 6,
					borderColor: 'var(--bs-border-color)',
					xaxis: {
						lines: {
							show: !0
						}
					},
					yaxis: {
						lines: {
							show: !1
						}
					},
					padding: {
						top: -32,
						left: 15,
						right: 18,
						bottom: 4
					},
				},
				responsive: [{
					breakpoint: 1920,
					options: {
						dataLabels: {
							formatter: function (e, t) {
								return p[t.dataPointIndex]
							}
						}
					}
				}]
			};
			var chartBar2 = new ApexCharts(document.querySelector("#ProjectChart"), options);
			chartBar2.render();
		}
		
		var activity1 = function(){
			var optionsArea = {
				series: [{
					name: "Running",
					data: [1400, 800, 1200, 550, 1550, 600, 1250]
				}],
				chart: {
					height: 250,
					type: 'area',
					group: 'social',
					toolbar: {
						show: false
					},
					zoom: {
						enabled: false
					},
				},
				dataLabels: {
					enabled: false
				},
				legend: {
					show:false,
					tooltipHoverFormatter: function(val, opts) {
						return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
					},
					markers: {
						fillColors:['var(--bs-primary)'],
						width: 3,
						height: 16,
						strokeWidth: 0,
						radius: 16
					}
				},
				markers: {
					size: [8,],
					strokeWidth: [4,],
					strokeColors: ['var(--bs-border-color)'],
					border:4,
					radius: 4,
					colors:['var(--bs-primary)'],
					hover: {
						size: 10,
					}
				},
				xaxis: {
					categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					labels: {
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 400, 
						},
					},
					axisBorder:{
						show: false,
					}
				},
				yaxis: {
					labels: {
						show: true,
						align: 'right',
						minWidth: 15,
						offsetX:-16,
						style: {
							colors: 'var(--bs-body-color)',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 400,
						},
					},
				},
				fill: {
					colors:['var(--bs-body-bg)','var(--bs-primary)'],
					type:'gradient',
					opacity: 1,
					gradient: {
						shade:'light',
						shadeIntensity: 1,
						colorStops: [[
							{
								offset: 0,
								color: 'var(--bs-primary)',
								opacity: 0.4
							},
							{
								offset: 0.6,
								color: 'var(--bs-primary)',
								opacity: 0.25
							},
							{
								offset: 100,
								color: 'var(--bs-primary)',
								opacity: 0
							}],
							[{
								offset: 0,
								color: 'var(--bs-primary)',
								opacity: .4
							},
							{
								offset: 50,
								color: 'var(--bs-primary)',
								opacity: 0.25
							},
							{
								offset: 100,
								color: '#fff',
								opacity: 0
							}]
						]},
					},
				colors:['var(--bs-primary)','var(--bs-primary)'],
				stroke:{
					curve : "straight",
					width: 3,
				},
				grid: {
					borderColor: 'var(--bs-border-color)',
					strokeDashArray:8,
					xaxis: {
						lines: {
							show: true,
							opacity: 0.5,
						}
					},
					yaxis: {
						lines: {
							show: true,
							opacity: 0.5,
						}
					},
					row: {
						colors: undefined,
						opacity: 0.5
					},  
					column: {
						colors: undefined,
						opacity: 0.5
					},  
				},
				responsive: [{
					breakpoint: 1602,
					options: {
						markers: {
							size: [6,6,4],
							hover: {
								size: 7,
							}
						},
						chart: {
							height: 230,
						},
					},
				}]
			};
			
			var chartArea = new ApexCharts(document.querySelector("#activity1"), optionsArea);
			chartArea.render();
		}
		
		var NewCustomers = function(){
			var options = {
				series: [
					{
						name: 'Net Profit',
						data: [100,300, 100, 400, 200, 400],
					}, 				
				],
				chart: {
					type: 'line',
					height: 250,
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false
					},
					sparkline: {
						enabled: true
					},
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
						left: 0
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
				x: {
					categories: ['Jan', 'feb', 'Mar', 'Apr', 'May'],
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
				y: {
					show: false,
				},
				fill: {
					opacity: 1,
					colors:'#FB3E7A'
				},
				tooltip: {
					enabled:true,
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
		
		var ExtraData = function(){
			var options = {
				series: [{
					name: 'Fb Analytics',
					data: [40, 55, 15,40,55, 15,40,50]
				}, {
					name: 'Google Ads',
					data: [55, 55, 35,60,55, 35,60,30]
				}, {
					name: 'Drrible User',
					data: [20, 17, 55, 45,17, 55, 45,20]
				}],
				chart: {
					type: 'bar',
					height: 260,
					stacked: true,
					toolbar: {
						show: false,
					}
				},
				plotOptions: {
					bar: {
						horizontal: false,
						columnWidth: '30%',
						endingShape: "rounded",
						startingShape: "rounded",
						backgroundRadius: 10,
						borderRadius: 5,
						colors: {
							backgroundBarColor: '#fff',
							backgroundBarOpacity: 1,
							backgroundBarRadius: 10,
						},
					},
					
				},
				stroke:{
					width:5,
					colors:["#fff"]
				},
				colors:['var(--bs-warning)', 'var(--bs-primary)', '#58bad7'],
				xaxis: {
					show: false,
					axisBorder: {
						show: false,
					},
					
					labels: {
						show: false,	
						style: {
							colors: '#828282',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 'light',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
					axisTicks: {
						show: false,
					},
					crosshairs: {
						show: false,
					},
					
				},
				yaxis: {
					show: false,
					labels: {
						style: {
							colors: '#828282',
							fontSize: '14px',
							fontFamily: 'Poppins',
							fontWeight: 'light',
							cssClass: 'apexcharts-xaxis-label',
						},
					},
				},
				grid: {
					show: false,
					borderColor: '#DBDBDB',
					strokeDashArray: 10,
					position: 'back',
					xaxis: {
						lines: {
							show: false
						}
					},   
					yaxis: {
						lines: {
							show: true
						}
					},  
				},
				toolbar: {
					enabled: false,
				},
				dataLabels: {
				  enabled: false
				},
				legend: {
					show:false
				},
				fill: {
					opacity: 1
				},
				responsive: [{
					breakpoint: 1601,
					options: {
						plotOptions: {
							bar: {
								columnWidth: '60%',
							},
							
						},
					},
				}]
			};

			var chart = new ApexCharts(document.querySelector("#ExtraData"), options);
			chart.render();
		}
 
		/* Function ============ */
		return {
			init:function(){
			
			},
			
			load:function(){
				columnChart();
				AllProject();
				Traffic();
				ProjectChart();
				activity1();
				NewCustomers();
				ExtraData();
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
