var bounds = {

	elPaso: [
		{"lng":-107.80277431732402,"lat":27.907624645213218},
		{"lng":-95.43809657202308,"lat":32.487001115904434}
	],

	us:[
		{"lng":-128.24023315399046,"lat":25.883319912551045},
		{"lng":-65.27802163078654,"lat":48.26730944613428}
	],

	texas: [
		{"lng":-107.24380284046838,"lat":25.260542901664394},
		{"lng":-93.05047067992092,"lat":36.151298512373145}
	],

	southwest: [
		{"lng":-125.0739604732316,"lat":25.966701150031795},
		{"lng":-91.98913119468861,"lat":43.43773063576569}
	],

	south: [
		{"lng":-126.39479078993031,"lat":23.89600104381762},
		{"lng":-73.86821071623382,"lat":44.96652579334989}
	],

	introChart:[
		{"lng":-113.21976046923375,"lat":36.086796079339976},
		{"lng":-86.14259761356354,"lat":54.62478262160215}
	]
};

var tasks = [

	// {
	// 	"text":["The job impact of automated trucks"],
	// 	textSize:"2em",
	// 	do: function(progress, entering) {

	// 		if (entering) vis.setOverlay('none')
	// 	}
	// },

	{
		"header": "The freight landscape: today and tomorrow",
		"text":[
			"Every day, millions of tons of goods move across the United States on the interstate highway system in Class 8 tractor trailer trucks."
		],
		
		do: function(progress, entering){
			var frame = Math.min(
				1000,
				Math.round(vis.styleWithScroll(1000, progress, 0.8))
			);

			map.setPaintProperty('us', 'line-gradient', animation.animFrame[frame])
			
			if (entering) {
				vis.setOverlay('us');
				map.fitBounds(bounds.us, {duration:1000})
				// map.easeTo({zoom:4})

			}
		}
	},


	{
		
		"text":[
			"Truck drivers move through many environments on these journeys: navigating industrial yards, parking lots, city streets, and highways.",
			"Truck drivers do lots of different work on that journey."
		],

		progressiveText: true,
		do: function(progress, entering){

			var secondStage = progress >0.5;

			if (entering) {
				vis.setOverlay('el paso');				
				map.fitBounds(bounds.elPaso, {duration:1000});

			}
			
			if (secondStage) {
				vis.setJourneyGraphic(1)
				vis.toggle('mainSections', '#journeyGraphics')
			}
			else vis.toggle('mainSections', '')

			d3.select('#container .p1')
				.style('opacity', () => {return secondStage ? 1 : 0})


		}
	},


	{
		"text":[
			"In industrial yards, they navigate a very dynamic environment, back up to the dock, attach air hoses, open and close doors, and talk to people."
		],
		do: function(progress, entering){

			if (entering) vis.setJourneyGraphic(2)
		}
	},

	{
		"text":["On surface streets, drivers navigate stop lights, watch out for pedestrians in crosswalks, and make tight turns with their articulated vehicles."],
		do: function(progress, entering){
			if (entering) vis.setJourneyGraphic(3)

		}
	},

	{
		"text":[
			"On highways, drivers monitor the road carefully and ensure safety in a much more structured and simple environment.",
			"Many of these environments are very difficult to automate, especially areas that require lots of time outside of the truck."
		],
		do: function(progress, entering){
			if (entering) vis.setJourneyGraphic(4)

		}
	},


	{
		"text":["In the future, trucks powered by Ike’s technology will navigate the highway without a driver, handing off loads to truckers for the more complex and valuable part of the journey on either end."],
		do: function(progress, entering){
			if (entering) vis.setJourneyGraphic(5)
		}
	},

	{
		"text": [
		"This approach simplifies the technical problem, automating the simplest and most monotonous part of the journey.",
		" It also means more jobs for truckers that keep them closer to home, using their skills and expertise where it matters."
		],

		do: function(progress, entering){
			
			if (entering) {
				vis.toggle('mainSections', '#journeyGraphics')
				vis.setJourneyGraphic(5)
			}
		}
	},

	{
		"text":["But how many jobs, and what’s the impact over time? Ike has worked with economist Dr. Charles Hodgson to explore the impact of automated trucks and our highway focused model on truck driving jobs."],
		do: function(progress, entering){
			if (entering) {

				vis.toggle('mainSections', '')

				vis.setOverlay('none');

				map.fitBounds(bounds.us, {duration:1000});
				d3.select('#chart')
					.classed('active', false)
			}
		}
	},

	{
		"header": "Effects of automation",
		"text":[
			"Automated trucks won’t be able to drive everywhere all at once. It will take years before they can drive complex routes, even on the highway.",
			"(Note this is a simplification used to build our analysis, not a prediction of the specific geographies or numbers. It’s still hard to know where and how automated trucks will deploy.)"
		],
		textSize: '0.85em',
		do: function(progress, entering){

			if (entering) {
				vis.toggle('mainSections', '#chart');
				// vis.toggle('chart', '#explainer .bar')


				d3.select('#chart')
					.classed('active', true)
					.attr('mode', 'explainer')

				vis.setExplainer(0)

			}


		}
	},

	{
		"text":[
			"For this analysis, we assumed four geographic zones that become available over time as automated trucking technology improves, and made a number of assumptions about cost and utilization.",
			"In each region, we start with a baseline number of trucking jobs, based on the total miles trucks drive on those roads each year."
		],

		do: function(progress, entering){

			if (entering) {
				vis.setExplainer(1)
				d3.select('#chartTitle')
					.text('Effects of Automation')
			}
		}
	},
	{
		"text":[
			"Then we model how many automated trucks that market would demand, and how many miles they drive, which tells us how many fewer baseline jobs there would be.",
			"Automated trucks can drive more miles than one person in a year, so the bars don’t even out.",
		],

		do: function(progress, entering){

				if (entering) vis.setExplainer(2)		

		}
	},
	{
		"text":[
			"But, because automated trucks need partners to move loads to and from the highway, there are new short haul jobs created from this model, which partially offset the loss in baseline jobs."
		],
		do: function(progress, entering, rewinding){


			if (entering) {

				if (rewinding) {
					vis.setExplainer(4);
					// vis.toggle('chart', '#explainer .bar')

					d3.select('#chart')
						.classed('active', true)
						.attr('mode', 'explainer')
				}

				else vis.setExplainer(3)

				d3.select('#chartTitle')
					.text('Effects of Automation')
			}				

			else if (progress>0.5 && state.slideProgress < 0.5) {
				vis.setExplainer(4)
			}

		}
	},
	{
		"header": "Texas by 2024",
		"text":[
			"Here’s what the model tells us could happen over time as we step through the four regions.",
			"Automated trucks may begin operating first on highways in Texas, handing off to local drivers.",
		],
		// textSize: '0.75em',
		do: function(progress, entering){


			if (entering) {
				vis.setOverlay('texas')
				map
				.fitBounds(bounds.texas, {duration:1000})
				vis.toggle('labelSet', '#types')
				// vis.toggle('chart', '#actualChart')

				d3.select('#chart')
					.classed('active', true)
					.attr('mode', 'actual')

				vis.setChart(1, true);
				d3.select('#actualChart')
					.classed('exploded',true)

			}
		}
	},
	{
		"header": "Texas by 2024",
		"text":[
			"Early on, we expect automated trucks to have uptime similar to today’s vehicles, and a cost profile that’s not much different. Still, small improvements can still generate new demand for freight. In our model, this actually creates new jobs in Texas in the first few years. "
		],
		// textSize: '0.75em',
		do: function(progress, entering){

		}
	},
	{
		"header": "Southwest by 2026",
		"text":[
			"By mid-decade, we assume automated trucks operate across the southwest United States, and in California. The good weather and high freight density are a good match, and the utilization of automated vehicles begins to improve productivity."
		],
		do: function(progress, entering){
			if (entering) {
				vis.setOverlay('southwest')
				map.fitBounds(bounds.southwest, {duration:1000});

				vis.toggle('labelSet', '#years')
				d3.select('.exploded')
					.classed('exploded',false)
				vis.setChart(2)
			}
		}
	},
	{
		"header": "South by 2028",
		"text":[
			"Over the next two years, automated trucks spread east and begin making journeys across the entire continent. The winter weather to the north likely requires more development and testing."
		],
		do: function(progress, entering){
			if (entering) {
				vis.setOverlay('south')
				map.fitBounds(bounds.south, {duration:1000})
				vis.setChart(3)
			}
		}
	},
	{
		"header": "Nationwide by 2030",
		"text":[
			"In ten years, we assume automated trucks operate across the entire country, and may begin working internationally. Utilization and cost savings reach maturity and drive big increases in freight volumes and short haul jobs."
		],
		do: function(progress, entering){
			map.fitBounds(bounds.us, {duration:1000})
			vis.setOverlay('us_blue')

			if (entering) {
				vis.toggle('mainSections', '#chart')
				vis.setChart(4)
			}
		}
	},
	{
		"text":[

			"Ten years from now, automated trucks will be hauling loads all across the country.",
			"This analysis tells us that many long haul truck driving jobs will shift to short haul. While that may not offset all the loss in jobs, it will mean more opportunities for truckers to sleep in their own beds at night and do the work that is hard to automate.", 
			"Let’s go deeper on how this model might impact real drivers.",
		],
		textSize: '0.95em',
		do: function(progress, entering){
			if (entering){
				map.easeTo({pitch:0})
				vis.setOverlay('us_blue')
				vis.toggle('mainSections', '')
				vis.toggle('chart', '#actualChart')
			}
		}
	},
	{
		"header": "Real driver stories",
		"text":[
			"At Ike, we’re focused on building technology that helps people. That means we have to understand truckers and make sure our product doesn’t leave them behind.",
			"The trucking industry is complex, and there any many kinds of driving jobs. Some truckers will see their roles change with automation, and some won’t.",
			"Let’s meet a few truckers with very different roles, and explore how their jobs may change in the future."
		],
		// textSize: '0.85em',

		do: function(progress, entering){
			if (entering) {
				vis.setOverlay(Object.keys(drivers).map(d=>drivers[d].layer))
				map.fitBounds(bounds.us, {duration:1000})
			}
		}
	},
	{
		"header": "Charles",
		"text":[
		],
		do: function(progress, entering){
			if (entering) buildProfiles('Charles')
		}
	},
	{
		"header": "How does Charles's job change?",
		"text":[
			'In the future, Charles may have more opportunities to work 9 to 5 and stay close to family and friends. His role may shift to local driving, handing off loads to automated trucks for the long haul.'
		],
	},


	{
		"header": "Don",
		"text":[
		],
		do: function(progress, entering){
			if (entering) buildProfiles('Don')
		}
	},
	{
		"header": "How does Don's job change?",
		"text":[
			"It doesn’t. Instead, many over the road drivers may shift to roles like Don’s, and he’ll have a lot more volume of freight available for local driving, with automated trucks sticking to the highways."
		],
	},
	{
		"header": "Steve",
		"text":[
		],
		do: function(progress, entering){
			if (entering) buildProfiles('Steve')
		}
	},
	{
		"header": "How does Steve's job change?",
		"text":[
			'It doesn’t. Experienced operators like Steve will be hauling specialized freight for a long time to come. Some day automated trucks may be able to do this work, but Steve will be long retired.'
		],
	},
	{
		"header": "Tiff",
		"text":[
		],
		do: function(progress, entering){
			if (entering) buildProfiles('Tiff')
		}
	},
	{
		"header": "How does Tiff's job change?",
		"text":[
			'Tiff may add automated trucks to her small fleet, and use her drivers to handle to and from the highway. She may find it easier to hire and retain drivers by helping them stay local.'
		],
	},
	{
		"header": "Tommy",
		"text":[
		],
		do: function(progress, entering){
			if (entering) {
				buildProfiles('Tommy')
				vis.setOverlay(Object.keys(drivers).map(d=>drivers[d].layer))
			}
		}
	},
	{
		"header": "How does Tommy's job change?",
		"text":[
			'It doesn’t. Even when automated trucks are driving throughout the country, AVOs like Tommy will be needed to help test and improve new versions of the technology.'
		],
	},
	{
		"text":[
			"Ike has open sourced this analysis under the MIT license. You can explore the full code and data on GitHub.", 
			"The model is built on top of one developed by Uber and open sourced in 2018.",
			"Comments and feedback are welcome at labor@ikerobotics.com",
			"We are hiring CDL drivers.",
			"Thanks to XXXXX for input and review of this analysis."
		],
		textSize: '0.75em',
		do: function(progress, entering){
			if(entering) vis.setOverlay('us_blue')
		}
	},
]

var navLinks = [
	{
		title: 'Intro', 
		page: 0, 
		do: function(){
			vis.toggle('mainSections', '')
		}
	},
	{
		title: 'Data', 
		page: 8, 
		do: function(){
			vis.toggle('mainSections', '');
			vis.toggle('labelSet', '#types');
			d3.select('#chart')
				.attr('mode', 'explainer')
		}
	},
	{title: 'Drivers', page: 18,do: function(){
		vis.toggle('mainSections', '')
	}}
]

var drivers = {
	Charles: {
		blurb: [
			'Over the road driver',
			'Age: 31',
			'Favorite haul: food for a church'
		],
		layer: 'midwest',
		quote: '“The hardest part is being away from your family, not getting that regular routine of working a 9 to 5. If I want to go out with my friends, that lifestyle is put aside for the permanent lifestyle of being a professional driver.”',
		change:'In the future, Charles may have more opportunities to work 9 to 5 and stay close to family and friends. His role may shift to local driving, handing off loads to automated trucks for the long haul.'
	},
	Don: {
		blurb: [
			'Local driver',
			'Age: 58',
			'Favorite haul: horses'
		],
		layer: 'st. louis',
		quote: '“I would never go over the road ever again. I sacrificed time and place for money, which is what truckers do. They sacrifice so much. It is a tough job. Mentally, emotionally, it is so tough”',
		change:"It doesn’t. Instead, many over the road drivers may shift to roles like Don’s, and he’ll have a lot more volume of freight available for local driving, with automated trucks sticking to the highways."
	},
	Steve: {
		blurb: [
			'Owner operator',
			'Age: 60',
			'Favorite haul: an antique Russian tank'
		],
		layer: 'southeast',
		quote: '“I like to stay out for four or five weeks and then take three weeks off. Some truckers will ask me how can you be gone that long, and I say to them, how can you work 52 weeks straight?”',
		change:'It doesn’t. Experienced operators like Steve will be hauling specialized freight for a long time to come. Some day automated trucks may be able to do this work, but Steve will be long retired.'
	},
	Tiff: {
		blurb: [
			'Small fleet owner',
			'Age: 44',
			'Favorite haul: ice cream'
		],
		layer: 'dallas',
		quote: '“I enjoy being able to take care of my drivers. When I was first starting out, I was earning like $400 a week and barely making it. Now I want to make sure to pay my drivers a decent salary so that they can make a living and also be able to enjoy life.”',
		change:'Tiff may add automated trucks to her small fleet, and use her drivers to handle to and from the highway. She may find it easier to hire and retain drivers by helping them stay local.'
	},
	Tommy: {
		blurb: [
			'Automated vehicle operator',
			'Age: 56',
			'Favorite haul: sailboats'
		],
		layer: 'california',
		quote: '“I used to be very skeptical of this automation stuff. Then I started looking into it more and I was reassured. The long hauls might be automated but there’s no way you’re going to have robots driving hazardous loads and local routes.”',
		change:'It doesn’t. Even when automated trucks are driving throughout the country, AVOs like Tommy will be needed to help test and improve new versions of the technology.'
	},

	style :{

	}
}


var chartData = [
	{data:[[19293], [16688, 3307, 2988]], area: 'Texas', year:2024},
	{data:[[89380], [70074, 14931, 18398]], area: 'Southwest', year:2026},
	{data:[[154630], [104530, 36351, 38553]], area: 'South', year:2028},
	{data:[[516843], [307522, 136446, 136147]], area: 'Nationwide', year:2030}
];

// var charts = {
// 	intro: {
// 		width:3,
// 		data: [
// 			{id:0, base:0, height:900000},
// 			{id:1, base:0, height:700000},
// 			{id:2, base:700000, height:800000},
// 			{id:3, base:800000, height:1050000},

// 		]
// 	}
// }
