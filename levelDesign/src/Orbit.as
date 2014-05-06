package  
{
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Thomas B
	 */
	public class Orbit extends MovieClip 
	{
		[Inspectable(defaultValue="NomPlanete", type="String")] 
		public var target : String;
		
		[Inspectable(defaultValue="0", type="Number")] 
		public var startAngle : Number;
		
		[Inspectable(defaultValue="0.025", type="Number")] 
		public var speed : Number;
		
		public function Orbit() 
		{
			super();
			
		}
		
	}

}