var state = {
	scrollPosition:0,
	currentSlide:0,
	slideDelayFraction: -0.5
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
					layer === driverLayer ? '#f09e05' : '#999'
				)			
		}
	},

	setSectionOpacity: function(section){

		var targetReached = false;
		var sections = ['#map canvas', '#journeyGraphics', '#chart'];

		for (candidate of sections) {
			d3.select(candidate)
				.style('opacity', ()=>{
					var opaque = !targetReached || candidate === section;
					targetReached = true;
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

	chart: {
		barColors:['#B7C3CD', '#6F7C7C', '#E5A039', '#054D7F'],
		barPadding:20,
		project: {
			xMargin: 20,
			yMargin: 20
		}
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
				'line-width':4,
				'line-color':'#0970b9',
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


	d3.select('#sidebar')
		.append('div')
		.attr('class', 'nav')
		.selectAll('div')
		.data(navLinks)
		.enter()
		.append('div')
		.text(d=>d.title)
		.on('click', (d)=>{
			document.querySelector('#sidebar')
				.scrollTo(0,innerHeight * d.page)
		})

	d3.select('#container')
		.append('p')
		.text(tasks[0].text[0])
		.style('font-size', '2em');

	d3.select('#journeyGraphics')
		.selectAll('img')
		.data([1,2,3,4,5])
		.enter()
		.append('img')
		.attr('src', d=>`./assets/journey-${d}.jpg`)
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
		// .style('opacity', (d,i) => {return i===0 ? 1 : 1})
		// .text(d=>d)
		// .attr('class', (d,i)=>{return 'p'+i})
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


function buildBarsGeoJSON(center, barWidth, barGap, properties) {

	barGap = barWidth/1.5;

	var centerLngs = [
		center[0] - (barWidth + barGap) * 1.5,
		center[0] - (barWidth + barGap) * 0.5,
		center[0] + (barWidth + barGap) * 0.5,
		center[0] + (barWidth + barGap) * 1.5,
	]

	var squareFormat = [
		[-0.5, -0.5],
		[-0.5, 0.5],
		[0.5, 0.5],
		[0.5, -0.5],
		[-0.5, -0.5]		
	]

	var footprints = centerLngs.map((c,i) => {

		var footprint = squareFormat.map((corner)=>{
			return [corner[0]* barWidth + c, corner[1]* barWidth + center[1]]
		})

		footprint = {
			type: 'Feature',
			properties: properties[i],
			geometry: {
			type: 'Polygon',
			coordinates:[footprint]
			}
		}
		return footprint
	})


	//add labels

	var labels = ['Jobs without automation', 'With automation', 'Automated trucks', 'New short-haul jobs'];

	centerLngs.forEach((lng,i)=>{
		var coord = [lng, center[1]-0.5*barWidth];

		footprints.push({
			type: 'Feature',
			properties: {text: labels[i], id:i},
			geometry: {
			type: 'Point',
			coordinates:coord
			}
		})
	})
	return {type: 'FeatureCollection', features: footprints}

}


function buildProfiles(name) {


	d3.select('#container')
		.append('img')
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

	d3.select('#container')
		.append('p')
		.selectAll('span')
		.data([`How does ${name}'s job change?`, drivers[name].change])
		.enter()
		.append('span')
		.text(d=>d)
		.style('font-weight', (d,i)=>{return i === 0 ? 'bold' : 'regular'})

	vis.highlightDriver(drivers[name].layer)
}
function buildChart(data){


	var chart = d3.select('#chart')
		.append('div')
		.attr('class','barSpace')
		.attr('id', 'explainer')

	chart
		.append('div')
		.attr('class', 'axisLabel')
		.text('Jobs')


	// actual chart

	var actualChart = d3.select('#chart')
		.append('div')
		.attr('class','barSpace')
		.attr('id', 'actualChart')

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


	// bars

	chart
		.selectAll('.bar')
		.data(data)
		.enter()
		.append('div')
		.attr('class', 'bar')
		.style('transform', 'scaleY(0)')
		.attr('id', (d,i)=>{return `bar${i}`})
		.style('width', 80/data.length+'%')
		.style('top', d=>100-d.max*100+'%')
		.style('bottom', d=>d.min*100+'%')
		.style('left', (d,i) => {
			return i * 100/data.length+ vis.chart.barPadding/data.length+'%'
		})
		.style('background', (d,i)=>{return vis.chart.barColors[i]})


	// labels

	chart
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


	// back to actual chart
	var year = actualChart
		.selectAll('.year')
		.data(chartData, d=>d)
		.enter()
		.append('div')
		.attr('class', 'year');

	year
		.selectAll('.bar')
		.data(d=>d.data)
		.enter()
		.append('div')
		.attr('class', 'bar')
		.style('width', '25%')
		.style('top', (d,i)=>{
			// var bottom = i === 0 ? 
			var scaled = d / chartData[3].data[0];
			// console.log(scaled)
			return (1-scaled)*100 + '%'
		})
		.style('bottom', 0)

	console.log(year.__data__)

}

buildChart([
	{min:0, max:0.7}, 
	{min:0, max:0.4},
	{min:0.4, max:0.6},
	{min:0.6, max:0.85}
])


function scrollTo(scrollTop){
	state.scrollPosition = scrollTop;
	var rawProgress = state.scrollPosition/innerHeight;

	var entering = state.currentSlide !== Math.floor(rawProgress);

	state.currentSlide = Math.floor(rawProgress);

	if (entering) {

		d3.selectAll('#container *')
			.remove();

		d3.select('#container')
		.selectAll('p')
		.data(d => tasks[state.currentSlide].text)
		.enter()
		.append('p')
		.style('font-size', tasks[state.currentSlide].textSize || '1em')
		.text(d=>d)
		.attr('class', (d,i)=>{return 'p'+i});

		if (tasks[state.currentSlide].progressiveText) {
			d3.selectAll('#container p')
				.style('opacity', (d,i)=>{return i === 0 ? 1 : 0})
		}

	}
	if (state.currentSlide>=0) tasks[state.currentSlide].do(rawProgress%1, entering);
}
document.querySelector('#sidebar').onscroll = function(e){

	scrollTo(e.target.scrollTop);

}

