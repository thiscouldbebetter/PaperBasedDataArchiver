
class Base64
{
	static digitsInOrder()
	{
		var charsInOrder =
			"0123456789"
			+ "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			+ "abcdefghijklmnopqrstuvwxyz+/";

		return charsInOrder;
	}

	static digitsAsCanvas()
	{
		var d = document;
		var canvasForCharactersAvailable =
			d.createElement("canvas");
		var graphics = canvasForCharactersAvailable.getContext("2d");
		todo

	}

}
