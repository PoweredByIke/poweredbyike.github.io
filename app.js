var state = {
	scrollPosition:-1,
	currentSlide:0,
	slideProgress: -0
}

var vis = {

	setOverlay: function(layerToShow){

		var overlays = [
			'texas',
			'el paso',
			'southwest',
			'south',
			'us',
			'us_blue',
			'california',
			'midwest',
			'southeast',
			'st. louis',
			'dallas'
		]

		if (typeof layerToShow ==='object') {
			console.log('is array')
			for (overlay of overlays) {
				map.setPaintProperty(
					overlay, 
					overlay === 'dallas' ? 'circle-opacity' : 'line-opacity', 
					layerToShow.indexOf(overlay) > -1 ? 1 : 0
				)	
			}			
		}

		else {
			for (overlay of overlays) {
				map.setPaintProperty(
					overlay, 
					overlay === 'dallas' ? 'circle-opacity' : 'line-opacity', 
					overlay === layerToShow ? 1 : 0
				)
			}	
		}
	},

	highlightDriver(driverLayer) {
		var layerList = Object.keys(drivers).map(d=>drivers[d].layer);

		for (layer of layerList) {
				map.setPaintProperty(
					layer, 
					layer === 'dallas' ? 'circle-color' : 'line-color', 
					layer === driverLayer ? '#f09e05' : '#064979'
				)			
		}
	},

	setSectionOpacity: function(section){

		var targetReached = false;
		var sections = ['#map canvas', '#journeyGraphics', '#chart'];

		for (candidate of sections) {
			d3.select(candidate)
				.style('opacity', ()=>{
					var hit = candidate === section;
					var opaque = !targetReached || hit;
					if (hit) targetReached = true;
					return opaque ? 1 : 0;
				})
		}
	},

	setJourneyGraphic: function(step){

		d3.selectAll('#journeyGraphics img')
			.style('opacity', d=> d <= step ? 1 : 0)
	},

	styleWithScroll: function(maxValue, progress, maxProgress) {
		return Math.min(progress/maxProgress, 1) * maxValue
	},

	toggleChartVisibility: function(chart){
		var charts = ['#explainer .bar', '#actualChart'];

		for (candidate of charts) {
			d3.selectAll(candidate)
				.style('opacity', candidate === chart ? 1 : 0)
		}
	},

	//toggle between steps (years) in actual chart
	setChart: function(step, exploded) {

		// update title

		// d3.select('#chartTitle')
		// 	.text(d=> `${chartData[step-1].area} by ${chartData[step-1].year}`)

		//update whole chart transform to fit on graph
		d3.select('#actualChart')
			.style('transform', `scaleX(${exploded ? 2.5 : 4/step})`);

		// fade in/out appropriate year
		d3.selectAll('.year')
			.classed('expanded', (d,i)=>{
				return i < step
			})
			.style('transform', (d,i)=>{
				return `scaleY(${d.max/chartData[step-1].max}) ${exploded ? 'translateX(-30%)' : ''}`
			})

		if (step >=2) {

			d3.select('#years')
				.style('transform', `scale(${4/step})`)
		}
	},


	//toggle between steps in explainer
	setExplainer(step, rewinding){
		


		var blocking = this.chart.choreography[step];

		d3.selectAll('#explainer .bar')
			.style('transform', (d,i)=>{return blocking.bar[i].transform});

		d3.selectAll('#types .label')
			.style('opacity', (d,i)=>{return blocking.label[i].opacity})	
			.style('transform', (d,i)=>{return blocking.label[i].transform});	

		

	},


	toggle: function(type, targetToActivate) {
		var candidates = this.toggles[type];

		for (candidate of candidates) {
			d3.selectAll(candidate)
				.style('opacity', candidate === targetToActivate ? 1 : 0)
		}
	},
	toggles: {
		mainSections:['#journeyGraphics', '#chart'],
		labelSet: ['#types', '#years'],
		chart: ['#explainer .bar', '#actualChart'],
	},
	chart: {
		barClasses: ['without', 'with', 'shortHaul', 'automated'],
		barColors:['#B7C3CD', '#6F7C7C', '#E5A039', '#054D7F'],
		barPadding:20,
		choreography: [
			//starting
			{
				bar: [
					{transform:''},
					{transform:''},
					{transform:''},
					{transform:'translate(-12%, 12%) scaleY(0)'}
				],
				label: [
					{opacity:0},
					{opacity:0},
					{opacity:0},
					{opacity:0}
				]
			},

			//first bar grows
			{
				bar: [
					{transform:'scaleY(1)'},
					{transform:''},
					{transform:''},
					{transform:'translate(-12vw, 80%) scaleY(0)'}
				],
				label: [
					{opacity:1},
					{opacity:0},
					{opacity:0},
					{opacity:0, transform: 'translate(-12vw, 0vh)'}
				]
			},

			//second and fourth bar grow, labels appear
			{
				bar: [
					{transform:'scaleY(1)'},
					{transform:'scaleY(1)'},
					{transform:''},
					{transform: 'translate(-12vw, 80%) scaleY(1) '}
				],
				label: [
					{opacity:1},
					{opacity:1},
					{opacity:0},
					{opacity:1, transform: 'translate(-12vw, 0vh)'}
				]
			},

			//fourth bar scoots over
			{
				bar: [
					{transform:'scaleY(1)'},
					{transform:'scaleY(1)'},
					{transform:''},
					{transform: 'translate(0vw, 80%) scaleY(1) '}
				],
				label: [
					{opacity:1},
					{opacity:1},
					{opacity:0},
					{opacity:1, transform: ''}
				]
			},

			//third bar grows, pushes fourth bar up
			{
				bar: [
					{transform:'scaleY(1)'},
					{transform:'scaleY(1)'},
					{transform:'scaleY(1)'},
					{transform: 'scaleY(1)'}
				],
				label: [
					{opacity:1},
					{opacity:1},
					{opacity:1},
					{opacity:1, transform: ''}
				]
			},
		]
	}
}
map.on('load', ()=>{

	map.fitBounds(bounds.us);

	map
		
		.addLayer({
			id: 'interstate', 
			type:'line',
			source:{
				type: 'geojson',
				data:'https://gist.githubusercontent.com/peterqliu/aac492c4392ca898b2a16889d9d303ba/raw/2db7226ded907841a914e9dc1340dd96f68218d2/truncated_us.geojson',
				lineMetrics: true
			},		
			paint: {
				'line-width': 2,
				'line-color': '#2e4545',
				'line-opacity': 0.25
			}
		}, 'states')
		.addLayer({
			id: 'us_blue', 
			type:'line',

			source:'interstate',		
			paint: {
				'line-width':{
					stops:[[0,1], [12,6]]
				},
				'line-color':'#064979',
				'line-opacity':0
			}
		})
		.addLayer({
			id: 'us', 
			type:'line',
			filter: ['!in', 'SIGN1', 'I5', 'I90', 'I40', 'I81', 'I29', 'I25', 'I94', 'I20'],
			source:'interstate',		
			paint: {
				'line-width':4,
				'line-color':'rgba(0,0,0,0)'
			}
		})


	d3.select('#headerBar')
		.append('div')
		.attr('class', 'nav')
		.selectAll('div')
		.data(navLinks)
		.enter()
		.append('div')
		.text(d=>d.title)
		.on('click', (d)=>{
			document.querySelector('#sidebar')
				.scrollTo(0,document.querySelector('#sidebar').offsetHeight * d.page)
				console.log(d)
			d.do();
		})


	d3.select('#journeyGraphics')
		.selectAll('img')
		.data([1,2,3,4,5])
		.enter()
		.append('img')
		.attr('src', d=>`./assets/journey-${d}.jpg`)

	populateSidebar(0)
})

buildSidebar();

function buildSidebar(){

	var section = d3.select('#drawer')
		.selectAll('section')
		.data(tasks)
		.enter()
		.append('section')
		.attr('id', (d,i)=>{return 'slide'+i});

	section
		.append('div')
		.style('padding', '10%')
		.selectAll('p')
		.data(d => d.text)
		.enter()
		.append('p')

}




var animation = {

	dashLength: 0.5,
	bodyLength: 0.4,
	headGap: 0.000001,
	lastUpdate: Date.now(),
	start: Date.now(),
	buildFrames: function(){

		var animFrame = [];

		for (var i = 0; i < 1000; i++){

		    var head = i/1000;
		    var gradient;

	        gradient = [
	            'interpolate',
	            ['linear'],
	            ['line-progress'],
	            head, this.buildColor(1),
	            head+this.headGap, this.buildColor(0)
	        ]

		    animFrame.push(gradient)

		}

		this.animFrame = animFrame
	},

	buildColor: function (opacity){
	    var color = '240,158,5,'
	    return 'rgba('+color+opacity+')'
	}

}

animation.buildFrames();



function buildProfiles(name) {


	d3.select('#container')
		.insert('img', ':first-child')
		.attr('class', 'driverMug')
		.attr('src', `./assets/driver-${name}.jpg`)

	d3.select('#container')
		.append('p')
		.selectAll('span')
		.data(drivers[name].blurb)
		.enter()
		.append('span')
		.style('display', 'block')
		.text(d=>d)

	d3.select('#container')
		.append('p')
		.append('span')
		.text(drivers[name].quote)
		.attr('class', 'quote blue')

	d3.select('#container')
		.append('p')
		.selectAll('span')
		.data([`How does ${name}'s job change?`, drivers[name].change])
		.enter()
		.append('span')
		.text(d=>d)
		.attr('class', (d,i)=>{return i === 0 ? 'blue bold' : 0})

	vis.highlightDriver(drivers[name].layer)
}

function buildExplainer(data){


	var chart = d3.select('#chart')
		.append('div')
		.attr('class','barSpace chart')
		.attr('id', 'explainer')

	chart
		.append('div')
		.attr('class', 'axisLabel')
		.text('Jobs')


	// bars

	chart
		.selectAll('.bar')
		.data(data)
		.enter()
		.append('div')
		.attr('class', (d,i)=>{return vis.chart.barClasses[i]+' bar'})
		.style('transform', 'scaleY(0)')
		.attr('id', (d,i)=>{return `bar${i}`})
		.style('width', 80/data.length+'%')
		.style('top', d=>100-d.max*100+'%')
		.style('bottom', d=>d.min*100+'%')
		.style('left', (d,i) => {
			return i * 100/data.length+ vis.chart.barPadding/data.length+'%'
		})
		// .classed((d,i)=>{return vis.chart.barClasses[i]}, true)


	// labels

	d3.select('#captions')
		.append('div')
		.attr('id', 'types')
		.selectAll('.label')
		.data([
			'Without automation', 
			'With automation', 
			'New short-haul jobs', 
			'Automated trucks'
		])
		.enter()
		.append('div')
		.attr('class', 'label')
		.attr('id', (d,i)=>{return `label${i}`})
		.style('left', (d,i) => (i + 0) * 100/data.length+ vis.chart.barPadding/data.length+'%')
		.style('width', 80/data.length + '%')
		.text(d=>d)


	d3.select('#captions')
		.append('div')
		.attr('id', 'years')
		.style('transform', 'scale(4)')
		.selectAll('.label')	
		.data(chartData)
		.enter()
		.append('div')
		.attr('class', 'label')	
		.style('margin-left',(d,i)=>{
			return `${7+25*i}%`
		})
		.style('opacity', 1)
		.text(d=>d.year)
}

buildExplainer([
	{min:0, max:0.7}, 
	{min:0, max:0.4},
	{min:0.4, max:0.6},
	{min:0.6, max:0.85}
])


function buildChart(){

	for (year of chartData) {
		var y = year.data[1];
		year.max = y[0] + y[1] + y[2]
	};
	// actual chart

	var actualChart = d3.select('#chart')
		.append('div')
		.attr('class','barSpace chart exploded')
		.attr('id', 'actualChart')


	// add one div per year
	var year = actualChart
		.selectAll('.year')
		.data(chartData, d=>d)
		.enter()
		.append('div')
		.attr('class', 'year')
		.attr('id', (d,i)=>{return `year${i}`})
		.style('transform', (d,i)=>{
			return `scaleY(${i ===0 ? 0 : d.max/chartData[0].max})`
		});

	// within each year, add two bars
	var bar = year
		.selectAll('.bar')
		.data(d => {

			var bars = [
				{bar: [1], scaled: d.data[0][0]/d.max},
				{bar: d.data[1].map(num=>num/d.max), scaled: 1}
			]


			return bars

		})
		.enter()
		.append('div')
		.attr('class', 'bar actual')
		.style('position', 'inherit')
		.style('transform', (d,i)=>{
			return `scaleY(${d.scaled})`
		})

	//within each bar, add sub-bars
	bar
		.selectAll('.subBar')
		.data(d=>d.bar)
		.enter()
		.insert('div',":first-child")
		.attr('class', (d, i)=>{

			var barIndex = d === 1 ? 0 : 1;
			return `subBar ${vis.chart.barClasses[i+barIndex]}`
		})
		.style('height', d=>`${d*100}%`)


	var svg = d3.select('#chart')
		.append('svg');

	// axes

	svg.append('line')
		.attr('x1', '0%')
		.attr('y1', '100%')
		.attr('x2', '0%')
		.attr('y2', '0%')
		.attr('class', 'axis')

	svg.append('line')
		.attr('x1', '0%')
		.attr('y1', '100%')
		.attr('x2', '100%')
		.attr('y2', '100%')
		.attr('class', 'axis');
}

buildChart();
// vis.setChart(1)

function scrollTo(scrollTop){

	state.scrollPosition = scrollTop;
	var rawProgress = state.scrollPosition/document.querySelector('#sidebar').offsetHeight;
	var newSlide = Math.floor(rawProgress);
	var entering = state.currentSlide !== newSlide;
	var rewinding = entering && state.currentSlide > newSlide;

	if (entering) populateSidebar(newSlide)

	if (state.currentSlide>=0) tasks[newSlide].do(rawProgress%1, entering, rewinding);

	state.currentSlide = newSlide;
	state.slideProgress = rawProgress%1

}

function populateSidebar(newSlide){
	var slide = tasks[newSlide];

	d3.selectAll('#container *')
		.remove();

	if (slide.header) {
		d3.select('#container')
			.append('div')
			.attr('class', 'bold blue header')
			.text(slide.header)
	}

	d3.select('#container')
	.selectAll('p')
	.data(d => slide.text)
	.enter()
	.append('p')
	.style('font-size', slide.textSize || '1em')
	.text(d=>d)
	.attr('class', (d,i)=>{return 'p'+i});

	if (tasks[state.currentSlide].progressiveText) {
		d3.selectAll('#container p')
			.style('opacity', (d,i)=>{return i === 0 ? 1 : 0})
	}	
}

document.querySelector('#sidebar').onscroll = function(e){

	scrollTo(e.target.scrollTop);

}

