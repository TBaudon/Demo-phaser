package
{
	
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.FileReference;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	// On pourrait utiliser un parser json plus tard.
	
	public class LevelExporter extends MovieClip
	{
		
		private var saveBTN : Sprite;
		
		public function LevelExporter()
		{
			loaderInfo.addEventListener(Event.INIT, onInit);
		}
		
		private function onInit(e:Event):void
		{
			// Cherche les planetes
			var planetes:Array = new Array();
			var asteroids:Array = new Array();
			
			// count obj
			for (var a = 0; a < this.numChildren; ++a)
			{
				if (this.getChildAt(a).name.charAt(0) == 'p')
					planetes.push(this.getChildAt(a));
				if (this.getChildAt(a).name.charAt(0) == 'a')
					asteroids.push(this.getChildAt(a));
			}
			
			json = "{\n";
			json += "\t\"name\": \"level\",\n";
			json += "\t\"description\": \"Level description goes here\",\n";
			if(s_params.mustCheckAll)
				json += '\t"mustCheckAll":' + s_params.mustCheckAll + ",\n\n";
			else
				json += '\n';
			json += "\t\"gravity\": {\n";
			json += "\t\t\"x\": 0,\n";
			json += "\t\t\"y\": 1\n";
			json += "\t},\n\n";
			json += "\t\"jumpStrength\": 25,\n\n";
			json += "\t\"planets\": {\n";
			
			for (var i:Number = 0; i < planetes.length; ++i)
			{
				var current:Planet = planetes[i];
				var objName:String = current.name;
				var libName:String = current.toString();
				libName = libName.substr(8, libName.length - 9);
				
				// Planete
				var planeteName:String = objName.substr(2);
				
				json += "\t\t\"" + planeteName + "\":{\n";
				json += "\t\t\t\"x\": " + current.x + ",\n";
				json += "\t\t\t\"y\": " + current.y + ",\n";
				
				var camObj = this.getChildByName('c_' + planeteName);
				
				if (camObj != null)
				{
					var camZ:Number = 800 / camObj.width;
					var camX:Number = (current.x - camObj.x) * camZ;
					var camY:Number = (current.y - camObj.y) * camZ;
					
					json += "\t\t\t\"cameraX\": " + camX + ",\n";
					json += "\t\t\t\"cameraY\": " + camY + ",\n";
					json += "\t\t\t\"cameraZ\": " + camZ + ",\n";
				}
				
				json += "\t\t\t\"rotSpeed\": " + current.rotSpeed + ",\n";
				json += "\t\t\t\"radius\": " + (current.width / 2) * 0.88 + ",\n";
				
				if (current.depart)
					json += "\t\t\t\"start\": true,\n";
				
				if (current.rebond)
					json += "\t\t\t\"bounce\": true,\n";
				
				if (current.checkPoint)
					json += "\t\t\t\"checkPoint\": true,\n";
				
				if (current.arrivee)
					json += "\t\t\t\"end\": true,\n";
				
				if (this.getChildByName('o_' + planeteName))
				{
					
					var orbit = this.getChildByName('o_' + planeteName);
					var target = this.getChildByName('p_' + orbit.target);
					
					var offsetX = orbit.x - target.x;
					var offsetY = orbit.y - target.y;
					
					var angle = orbit.rotation;
					
					orbit.rotation = 0;
					
					json += "\t\t\t\"orbit\":{\n";
					json += "\t\t\t\t\"width\":" + orbit.width / 2 + ",\n";
					json += "\t\t\t\t\"height\":" + orbit.height / 2 + ",\n";
					json += "\t\t\t\t\"angle\":" + angle + ",\n";
					json += "\t\t\t\t\"startAngle\":" + orbit.startAngle + ",\n";
					json += "\t\t\t\t\"speed\":" + orbit.speed + ",\n";
					json += "\t\t\t\t\"x\":" + offsetX + ",\n";
					json += "\t\t\t\t\"y\":" + offsetY + ",\n";
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
			
			json += "\t},\n";
			
			json += "\t\"asteroids\":{\n";
			
			for (var j = 0; j < asteroids.length; ++j)
			{
				var currentA = asteroids[j];
				libName = currentA.toString();
				libName = libName.substr(8, libName.length - 9);
				
				objName = currentA.name;
				
				var asteroidName : String = objName.substr(2);
				
				json += "\t\t\"" + asteroidName + "\": { \n";
				
				json += "\t\t\t\"radius\":" + currentA.width / 2 * 0.9 + ",\n";
				
				json += "\t\t\t\"x\":" + currentA.x + ",\n";
				json += "\t\t\t\"y\":" + currentA.y + ",\n";
				json += "\t\t\t\"rotSpeed\":" + currentA.rotSpeed + ",\n";
				
				if (this.getChildByName('o_' + asteroidName))
				{
					
					orbit = this.getChildByName('o_' + asteroidName);
					target = this.getChildByName('p_' + orbit.target);
					
					offsetX = orbit.x - target.x;
					offsetY = orbit.y - target.y;
					
					angle = orbit.rotation;
					orbit.rotation = 0;
					
					json += "\t\t\t\"orbit\":{\n";
					json += "\t\t\t\t\"width\":" + orbit.width / 2 + ",\n";
					json += "\t\t\t\t\"height\":" + orbit.height / 2 + ",\n";
					json += "\t\t\t\t\"angle\":" + angle + ",\n";
					json += "\t\t\t\t\"startAngle\":" + orbit.startAngle + ",\n";
					json += "\t\t\t\t\"speed\":" + orbit.speed + ",\n";
					json += "\t\t\t\t\"x\":" + offsetX + ",\n";
					json += "\t\t\t\t\"y\":" + offsetY + ",\n";
					json += "\t\t\t\t\"target\":\"" + orbit.target + "\"\n";
					json += "\t\t\t},\n";
				}
				
				json += "\t\t\t\"graph\":\"" + libName + "\"\n";
				
				json += "\t\t}";
				if (j == asteroids.length - 1)
					json += "\n";
				else
					json += ",\n";
			}
			
			json += "\t}\n";
			json += "}\n";
			
			initSaveBTN();
		}
		
		private var saveFileRef : FileReference;
		private var json:String;
		
		private function initSaveBTN():void 
		{
			saveBTN = new Sprite();
			saveBTN.graphics.beginFill(0xff4400);
			saveBTN.graphics.drawRect(0, 0, 150, 40);
			saveBTN.graphics.endFill();
			saveBTN.useHandCursor = true;
			saveBTN.buttonMode = true;
			saveBTN.mouseChildren = false;
			
			var text : TextField = new TextField();
			text.selectable = false;
			text.defaultTextFormat = new TextFormat("Arial", 24, 0x000000, true);
			text.autoSize = TextFieldAutoSize.LEFT;
			text.text = "Save";
			
			saveBTN.addChild(text);
			text.x = (saveBTN.width - text.width) / 2;
			text.y = (saveBTN.height - text.height) / 2;
			
			addChild(saveBTN);
			
			saveBTN.addEventListener(MouseEvent.CLICK, onSavePressed);
			
			saveFileRef = new FileReference();
			saveFileRef.addEventListener(Event.COMPLETE, onSaveComplete);
		}
		
		private function onSaveComplete(e:Event):void 
		{
			trace("Niveau enregistré.");
		}
		
		private function onSavePressed(e:MouseEvent):void 
		{
			saveFileRef.save(json, "level.json");
		}
	}

}
