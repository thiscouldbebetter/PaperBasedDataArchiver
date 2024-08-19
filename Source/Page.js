
class Page
{
	constructor
	(
		sizeInInches,
		marginInInches,
		pixelsPerInch,
		font,
		dataAsBytes,
		dataAsCanvas
	)
	{
		this.sizeInInches = sizeInInches;
		this.marginInInches = marginInInches;
		this.pixelsPerInch = pixelsPerInch;
		this.font = font;
		this.dataAsBytes = dataAsBytes;
		this.dataAsCanvas = dataAsCanvas;
	}

	static fromDocument(document)
	{
		var d = document;

		var pageSizeInInches = new Coords
		(
			parseFloat(d.getElementById("inputPageSizeInInchesX").value),
			parseFloat(d.getElementById("inputPageSizeInInchesY").value)
		);

		var marginSizeInInches = new Coords
		(
			parseFloat(d.getElementById("inputMarginInInchesX").value),
			parseFloat(d.getElementById("inputMarginInInchesY").value)
		);

		var pixelsPerInch =
			parseInt(d.getElementById("inputPixelsPerInch").value);

		var fontName =
			d.getElementById("selectFontName").value;

		var fontHeightInPixels =
			parseInt(d.getElementById("inputFontHeightInPixels").value);

		var font = new Font(fontName, fontHeightInPixels);

		var divImage = d.getElementById("divImage");
		var dataAsCanvas = divImage.children[0]; // Will be null at first.

		var page = new Page
		(
			pageSizeInInches,
			marginSizeInInches,
			pixelsPerInch,
			font,
			null, // dataAsBytes
			dataAsCanvas
		);

		return page;
	}

	characterGridDraw()
	{
		if (this.dataAsCanvas != null)
		{
			var d = document;
			var canvasForOverlay = d.createElement("canvas");
			canvasForOverlay.width = this.dataAsCanvas.width;
			canvasForOverlay.height = this.dataAsCanvas.height;

			var graphics = canvasForOverlay.getContext("2d");
			graphics.strokeStyle = "Cyan";

			var sizeInChars = this.sizeInChars();
			var charSizeInPixels = this.charSizeInPixels();
			var drawPosInChars = new Coords(0, 0);
			var drawPosInPixels = new Coords(0, 0);
			var marginSizeInPixels = this.marginInPixels();

			for (var y = 0; y < sizeInChars.y; y++)
			{
				drawPosInChars.y = y;

				for (var x = 0; x < sizeInChars.x; x++)
				{
					drawPosInChars.x = x;

					drawPosInPixels
						.overwriteWith(drawPosInChars)
						.multiply(charSizeInPixels)
						.add(marginSizeInPixels)
						.addXY(0, this.font.heightInPixels);

					graphics.strokeRect
					(
						drawPosInPixels.x, drawPosInPixels.y - charSizeInPixels.y,
						charSizeInPixels.x, charSizeInPixels.y
					);
				}
			}

			var graphics2 = this.dataAsCanvas.getContext("2d");
			graphics2.drawImage(canvasForOverlay, 0, 0);
		}

	}

	charSizeInPixels()
	{
		var d = document;
		var canvas = d.createElement("canvas");
		var graphics = canvas.getContext("2d");
		graphics.font = this.font.toSystemFont();
		var charMeasurement = graphics.measureText("M");
		var charSizeInPixels =
			new Coords(charMeasurement.width, this.font.heightInPixels);

		return charSizeInPixels;
	}

	dataAsBytesSet(values)
	{
		this.dataAsBytes = values;
		return this;
	}

	dataAsCanvasConvertToBytes()
	{
		// OCR.

		todo
	}

	dataAsBase64()
	{
		return atob(this.dataAsBytes);
	}

	marginInPixels()
	{
		var returnValue = this.marginInInches
			.clone()
			.multiplyScalar(this.pixelsPerInch);

		return returnValue;
	}

	sizeInChars()
	{
		var sizeInPixelsMinusMargins =
			this.sizeInPixelsMinusMargins();
		var charSizeInPixels = this.charSizeInPixels();
		var returnValue =
			sizeInPixelsMinusMargins
				.divide(charSizeInPixels)
				.floor();

		return returnValue;
	}

	sizeInInchesMinusMargins()
	{
		var returnValue =
			this.sizeInInches
				.clone()
				.subtract(this.marginInInches)
				.subtract(this.marginInInches);

		return returnValue;
	}

	sizeInPixels()
	{
		var returnValue =
			this.sizeInInches
				.clone()
				.multiplyScalar(this.pixelsPerInch);

		return returnValue;
	}

	sizeInPixelsMinusMargins()
	{
		var returnValue =
			this.sizeInInchesMinusMargins()
				.multiplyScalar(this.pixelsPerInch);

		return returnValue;
	}

	toCanvasForDocument(d)
	{
		var sizeInPixels = this.sizeInPixels();

		var canvas = d.createElement("canvas");
		canvas.width = sizeInPixels.x;
		canvas.height = sizeInPixels.y;

		var graphics = canvas.getContext("2d");
		graphics.fillStyle = "Black";
		graphics.font = this.font.toSystemFont();

		var dataAsBase64 = this.dataAsBase64();

		var dataAsLines = [];

		var sizeInChars = this.sizeInChars();
		var charSizeInPixels = this.charSizeInPixels();
		var drawPosInChars = new Coords(0, 0);
		var drawPosInPixels = new Coords(0, 0);
		var marginSizeInPixels = this.marginInPixels();

		for (var y = 0; y < sizeInChars.y; y++)
		{
			drawPosInChars.y = y;

			for (var x = 0; x < sizeInChars.x; x++)
			{
				drawPosInChars.x = x;

				drawPosInPixels
					.overwriteWith(drawPosInChars)
					.multiply(charSizeInPixels)
					.add(marginSizeInPixels)
					.addXY(0, this.font.heightInPixels);

				var charOffset = y * sizeInChars.x + x;

				var charToDraw = dataAsBase64[charOffset];

				graphics.fillText
				(
					charToDraw,
					drawPosInPixels.x, drawPosInPixels.y
				);
			}
		}

		this.dataAsCanvas = canvas;

		return this.dataAsCanvas;
	}
}
