
class UiEventHandler
{
	static buttonBase64ToImage_Clicked()
	{
		var d = document;

		var textareaDataAsBase64 =
			d.getElementById("textareaDataAsBase64");
		var dataAsBase64 = textareaDataAsBase64.value;
		var dataAsBytes = btoa(dataAsBase64);

		var page = Page.fromDocument(d);

		page.dataAsBytesSet(dataAsBytes);

		var pageAsCanvas = page.toCanvasForDocument(d);

		var divImage = d.getElementById("divImage");
		divImage.innerHTML = "";
		divImage.appendChild(pageAsCanvas);
	}

	static buttonDemo_Clicked()
	{
		var d = document;

		var page = Page.fromDocument(d);

		var pageSizeInChars = page.sizeInChars();

		var charsInOrder = Base64.digitsInOrder();

		var linesSoFar = [];

		for (var y = 0; y < pageSizeInChars.y; y++)
		{
			var lineSoFar = "";

			for (var x = 0; x < pageSizeInChars.x; x++)
			{
				var charRandomIndex =
					Math.floor(charsInOrder.length * Math.random() );

				var charRandom = charsInOrder[charRandomIndex];

				lineSoFar += charRandom;
			}

			linesSoFar.push(lineSoFar);
		}

		var textareaDataAsBase64 =
			d.getElementById("textareaDataAsBase64");

		textareaDataAsBase64.value = linesSoFar.join("");
	}

	static buttonDrawCharacterGrid_Clicked()
	{
		var d = document;
		var page = Page.fromDocument(d);
		page.characterGridDraw();
	}

	static buttonImageToBase64_Clicked()
	{
		alert("Not yet implemented!");
	}

	static inputFileBytes_Changed(inputFileBytes)
	{
		var file = inputFileBytes.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var fileAsBinaryString = event.target.result;
				var fileAsBytes =
					fileAsBinaryString
						.split("")
						.map(x => x.charCodeAt(0) );
				var fileAsBase64 = btoa(fileAsBytes);
				var d = document;
				var textareaDataAsBase64 =
					d.getElementById("textareaDataAsBase64");
				textareaDataAsBase64.value = fileAsBase64;
			}
			fileReader.readAsBinaryString(file);
		}
	}

	static inputFileImage_Changed(inputFileImage)
	{
		var file = inputFileBytes.files[0];
		if (file != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var fileAsDataUrl = event.target.result;
				var d = document;
				var fileAsImgElement = d.createElement("img");
				fileAsImgElement.onload = (event2) =>
				{
					var fileAsCanvas = d.createElement("canvas");
					fileAsCanvas.width = fileAsImgElement.width;
					fileAsCanvas.height = fileAsImgElement.height;
					var graphics = fileAsCanvas.getContext("2d");
					graphics.drawImage(fileAsImgElement);

					var divImage =
						d.getElementById("divImage");
					divImage.innerHTML = "";
					divImage.appendChild(fileAsCanvas);
				}
				fileAsImgElement.src = fileAsDataUrl;
			}
			fileReader.readAsDataUrl(file);
		}
	}
}
