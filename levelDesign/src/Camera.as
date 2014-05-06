package 
{
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Thomas B
	 */
	public class Camera extends MovieClip 
	{
		
		[Inspectable(defaultValue = "null", type = "Planet")]
		public var target : Planet;
		
		public function Camera() 
		{
			super();
			
		}
		
	}

}