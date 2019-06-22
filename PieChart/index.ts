import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as d3 from 'd3';
import {DefaultArcObject, PieArcDatum} from "d3";

interface PieData {
	category: string;
	quantity: number;
}

export class PieChart implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _value: string;
	private _container: string;


	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void,
				state: ComponentFramework.Dictionary,
				container:HTMLDivElement)
	{
		this._container = "." + container.className.replace(" ", ",.");
		let dataSet = context.parameters.JsonChart.formatted
			? context.parameters.JsonChart.formatted : '[{"category":"No Data","quantity":100}]';

		if(this.IsJsonString(dataSet)) {
			this.drawChart(this._container, JSON.parse(dataSet));
		}else
		{
			this.drawChart(this._container, JSON.parse('[{"category":"Wrong format","quantity":100}]'));
		}
	}


	public drawChart(component: string , data: Array<PieData>) {
		let width = 480,
			height = 250,
			radius = Math.min(width, height) / 2,
			colourValues = d3.scaleOrdinal().range(["#98abc5",
				"#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

		let arc = d3.arc()
			.innerRadius(radius - 30)
			.outerRadius(radius - 100);

		// notice accessor receives d of type Datum
		let pie = d3.pie<PieData>()
			.sort(null).value((d: PieData):number => d.quantity);

		let fill = (d: PieArcDatum<PieData>): string => String(colourValues(d.data.category));
		let text = (d: PieArcDatum<PieData>): string => d.data.category;
		let tfx = function(d: DefaultArcObject){
			return "translate(" + ( (radius - 12)
				* Math.sin( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) )
				+ "," + ( -1 * (radius - 12)
					* Math.cos( ((d.endAngle - d.startAngle) / 2) + d.startAngle ) ) + ")";
		};

		d3.select(component).select("svg").remove();

		let componentSvg = d3.select(component).append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

		// create a group for the pie chart
		let g = componentSvg.selectAll('.arc')
			.data(pie(data))
			.enter().append('g').attr('class', 'arc');

		// add pie sections
		g.append('path')
			.attr('d', <any>arc)
			.attr('fill', <any>fill)
			.attr("stroke", "white")
			.style("stroke-width", "2px")
			.style("opacity", 1);

		// add labels
		g.append('text')
			.attr("style", "font: 10px sans-serif;")
			.attr("dy", ".35em")
			.attr('transform', <any>tfx)
			.style("text-anchor", function(d: PieArcDatum<PieData>) {
				var rads = ((d.endAngle - d.startAngle) / 2) + d.startAngle;
				if ( (rads > 7 * Math.PI / 4 && rads < Math.PI / 4)
					|| (rads > 3 * Math.PI / 4 && rads < 5 * Math.PI / 4) ) {
					return "middle";
				} else if (rads >= Math.PI / 4 && rads <= 3 * Math.PI / 4) {
					return "start";
				} else if (rads >= 5 * Math.PI / 4 && rads <= 7 * Math.PI / 4) {
					return "end";
				} else {
					return "middle";
				}
			})
			.text(<any>text)
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		this._value = context.parameters.JsonChart.raw;
		let dataSet = JSON.parse(context.parameters.JsonChart.formatted ?
			context.parameters.JsonChart.formatted : '[{"category":"No Data","quantity":100}]');

		if(this.IsJsonString(dataSet)) {
			this.drawChart(this._container, JSON.parse(dataSet));
		}else
		{
			this.drawChart(this._container, JSON.parse('[{"category":"Wrong format","quantity":100}]'));
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			JsonChart : this._value
		};
	}

	private IsJsonString(str:string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}
