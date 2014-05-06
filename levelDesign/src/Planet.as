package 
{
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Thomas B
	 */
	public class Planet extends MovieClip 
	{
		[Inspectable(defaultValue="false")] 
		public var depart : Boolean;
		
		[Inspectable(defaultValue="false")]
		public var checkPoint : Boolean;
		
		[Inspectable(defaultValue="false")]
		public var arrivee : Boolean;
		
		[Inspectable(defaultValue="false")]
		public var rebond : Boolean;
		
		[Inspectable(type="Number")]
		public var rotSpeed : Number;
		
		public function Planet() 
		{
			super();
			
		}
		
	}

}