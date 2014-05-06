package 
{
	
	import flash.display.MovieClip;
	import flash.events.Event;
	
	// On pourrait utiliser un parser json plus tard.
	
	public class LevelExporter extends MovieClip
	{
		
		public function LevelExporter()
		{
			loaderInfo.addEventListener(Event.INIT, onInit);
		}
		
		private function onInit(e:Event):void 
		{
			// Cherche les planetes
			var planetes:Array = new Array();
			
			for (var a = 0; a < this.numChildren; ++a)
			{
				if (this.getChildAt(a).name.charAt(0) == 'p')
					planetes.push(this.getChildAt(a));
			}
			
			var json:String = "{\n";
			json += "\t\"name\": \"level\",\n";
			json += "\t\"description\": \"Level description goes here\",\n\n";
			json += "\t\"gravity\": {\n";
			json += "\t\t\"x\": 0,\n";
			json += "\t\t\"y\": 1\n";
			json += "\t},\n\n";
			json += "\t\"jumpStrength\": 25,\n\n";
			json += "\t\"planets\": {\n";
			
			for (var i:Number = 0; i < planetes.length; ++i)
			{
				var current : Planet = planetes[i];
				var objName:String = current.name;
				var libName:String = current.toString();
				libName = libName.substr(8, libName.length - 9);
				
				// Planete
				if (objName.charAt(0) == 'p')
				{
					var planeteName:String = objName.substr(2);
					
					json += "\t\t\"" + planeteName + "\":{\n";
					json += "\t\t\t\"x\": " + current.x + ",\n";
					json += "\t\t\t\"y\": " + current.y + ",\n";
					
					var camObj = this.getChildByName('c_' + planeteName);
					
					if(camObj != null) {
						var camZ:Number = 800 / camObj.width;
						var camX:Number = (current.x - camObj.x) * camZ;
						var camY:Number = (current.y - camObj.y) * camZ;
						
						json += "\t\t\t\"cameraX\": " + camX + ",\n";
						json += "\t\t\t\"cameraY\": " + camY + ",\n";
						json += "\t\t\t\"cameraZ\": " + camZ + ",\n";
					}
					
					json += "\t\t\t\"rotSpeed\": " + current.rotSpeed + ",\n";
					json += "\t\t\t\"radius\": " + (current.width / 2) * 0.9 + ",\n";
					
					if (current.depart)
						json += "\t\t\t\"start\": true,\n";
					
					if (current.rebond)
						json += "\t\t\t\"bounce\": true,\n";
						
					if (current.checkPoint)
						json += "\t\t\t\"checkPoint\": true,\n";
						
					if (current.arrivee)
						json += "\t\t\t\"end\": true,\n";
						
					if (this.getChildByName('o_' + planeteName)) {
						
						var orbit  = this.getChildByName('o_' + planeteName);
						var target = this.getChildByName('p_' + orbit.target);
						
						var offsetX = orbit.x - target.x;
						var offsetY = orbit.y - target.y;
						
						json += "\t\t\t\"orbit\":{\n";
						json += "\t\t\t\t\"width\":" + orbit.width/2 + ",\n";
						json += "\t\t\t\t\"height\":" + orbit.height/2 + ",\n";
						json += "\t\t\t\t\"angle\":" + orbit.rotation + ",\n";
						json += "\t\t\t\t\"startAngle\":" + orbit.startAngle + ",\n";
						json += "\t\t\t\t\"speed\":" + orbit.speed + ",\n";
						json += "\t\t\t\t\"x\":" +offsetX + ",\n";
						json += "\t\t\t\t\"y\":" +offsetY + ",\n";
						json += "\t\t\t\t\"target\":\"" + orbit.target + "\"\n";
						json += "\t\t\t},\n";
					}	
					
					json += "\t\t\t\"element\": \"" + libName + "\"\n";
					
					json += "\t\t}";
					if (i == planetes.length - 1)
						json += "\n";
					else
						json += ",\n";
				}
			}
			
			json += "\t}\n";
			json += "}\n";
			trace(json);
		}
	}

}
