
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

		var pageSizeInSymbols = page.sizeInSymbols();

		var charsInOrder = Base64.digitsInOrder();

		var linesSoFar = [];

		for (var y = 0; y < pageSizeInSymbols.y; y++)
		{
			var lineSoFar = "";

			for (var x = 0; x < pageSizeInSymbols.x; x++)
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
		var d = document;

		var divImage = d.getElementById("divImage");
		var pageAsCanvas = divImage.children[0];
		var graphicsForReadingFromPage =
			pageAsCanvas.getContext("2d", { willReadFrequently: true } );

		var page = Page.fromDocument(d);
		var symbolsAllowed = Base64.digitsInOrder();
		var symbolsAllowedAsCanvas = page.symbolsAllowedAsCanvas();
		var graphicsForSymbolsToCompareAgainst =
			symbolsAllowedAsCanvas.getContext("2d", { willReadFrequently: true } );
		
		var sizeInSymbols = page.sizeInSymbols();
		var symbolSizeInPixels = page.symbolSizeInPixels();
		var symbolSizeInPixelsRoundedUp = symbolSizeInPixels.ceiling();
		var readPosInSymbols = Coords.zeroes();
		var readPosInPixels = Coords.zeroes();
		var marginSizeInPixels = page.marginInPixels();
		var symbolToCompareAgainstPosInPixels = Coords.zeroes();
		var symbolToCompareAgainstPosInPixelsRounded = Coords.zeroes();

		var symbolLinesReadFromPageSoFar = [];

		for (var y = 0; y < sizeInSymbols.y; y++)
		{
			// For each line of symbols on the scanned page image.
			
			readPosInSymbols.y = y;

			var symbolsReadFromLineSoFar = "";

			for (var x = 0; x < sizeInSymbols.x; x++)
			{
				// For each symbol on the line from the scanned page image.
				
				readPosInSymbols.x = x;

				readPosInPixels
					.overwriteWith(readPosInSymbols)
					.multiply(symbolSizeInPixels)
					.add(marginSizeInPixels);

				var symbolFromPageAsImageData =
					graphicsForReadingFromPage.getImageData
					(
						readPosInPixels.x, readPosInPixels.y,
						symbolSizeInPixelsRoundedUp.x, symbolSizeInPixelsRoundedUp.y
					).data;

				var pixelDifferenceMinSoFar = null;
				var symbolWithLeastDifferenceSoFar = null;
				var componentsPerPixel = 4; // Red, green, blue, and alpha.
				var cMax = componentsPerPixel - 1; // Ignore alpha.

				symbolToCompareAgainstPosInPixels.clear();
				
				for (var s = 0; s < symbolsAllowed.length; s++)
				{
					// For each possible symbol to compare the read image against.
					
					var symbolToCompareAgainst = symbolsAllowed[s];
					
					var symbolToCompareAgainstAsImageData =
						graphicsForSymbolsToCompareAgainst.getImageData
						(
							symbolToCompareAgainstPosInPixels.x, // hack
							symbolToCompareAgainstPosInPixels.y,
							symbolSizeInPixelsRoundedUp.x,
							symbolSizeInPixelsRoundedUp.y
						).data;

					var pixelDifferenceSoFar = 0;
				
					for (var yy = 0; yy < symbolSizeInPixels.y; yy++)
					{
						// For each pair of corresponding rows
						// in the two symbol images to compare.
						
						for (var xx = 0; xx < symbolSizeInPixels.x; xx++)
						{
							// For each pair of coresponding pixels
							// in the current row of the two symbol images to compare.

							var pixelIndex = (yy * symbolSizeInPixels.x + xx);
							var pixelOffsetInComponents = pixelIndex * componentsPerPixel;
							
							for (var c = 0; c < cMax; c++)
							{
								// For each color component in the pixel.

								var pixelComponentFromPage =
									symbolFromPageAsImageData[pixelOffsetInComponents + c];
							
								var pixelComponentFromSymbolToCompareAgainst =
									symbolToCompareAgainstAsImageData[pixelIndex];
									
								var componentDifference = Math.abs
								(
									pixelComponentFromPage
									- pixelComponentFromSymbolToCompareAgainst
								);

								pixelDifferenceSoFar += componentDifference;
								
							} // end for each component in pixel
							
						} // end for pixel in row to compare
						
					} // end for each row in symbol images to compare

					if
					(
						pixelDifferenceMinSoFar == null
						|| pixelDifferenceSoFar < pixelDifferenceMinSoFar
					)
					{
						pixelDifferenceMinSoFar = pixelDifferenceSoFar;
						symbolWithLeastDifferenceSoFar = symbolToCompareAgainst;
					}

					symbolToCompareAgainstPosInPixels.x +=
						symbolSizeInPixels.x;
			
				} // end for each symbol to compare against

				symbolsReadFromLineSoFar += symbolWithLeastDifferenceSoFar;

			} // end for each symbol cell in row

			symbolLinesReadFromPageSoFar.push(symbolsReadFromLineSoFar);
			
		} // end for each row of symbols on page
		
		var newline = "\n";

		var symbolsReadFromPage =
			symbolLinesReadFromPageSoFar.join(newline);

		var textareaDataAsBase64 =
			d.getElementById("textareaDataAsBase64");
		textareaDataAsBase64.value = symbolsReadFromPage;
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
