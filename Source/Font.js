
class Font
{
	constructor(name, heightInPixels)
	{
		this.name = name;
		this.heightInPixels = heightInPixels;
	}

	toSystemFont()
	{
		return this.heightInPixels + "px " + this.name;
	}
}
