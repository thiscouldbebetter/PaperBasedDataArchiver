
class Base64
{
	static digitsInOrder()
	{
		var charsInOrder =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
			+ "abcdefghijklmnopqrstuvwxyz";
			+ "0123456789"
			+ "+/";

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
