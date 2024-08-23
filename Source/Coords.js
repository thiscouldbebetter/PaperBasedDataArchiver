
class Coords
{
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

	static zeroes()
	{
		return new Coords(0, 0);
	}
	
	add(other)
	{
		this.x += other.x;
		this.y += other.y;
		return this;
	}

	addXY(x, y)
	{
		this.x += x;
		this.y += y;
		return this;
	}

	ceiling()
	{
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}
	
	clear()
	{
		this.x = 0;
		this.y = 0;
		return this;
	}

	clone()
	{
		return new Coords(this.x, this.y);
	}

	divide(other)
	{
		this.x /= other.x;
		this.y /= other.y;
		return this;
	}

	floor()
	{
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	multiply(other)
	{
		this.x *= other.x;
		this.y *= other.y;
		return this;
	}

	multiplyScalar(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

	overwriteWith(other)
	{
		this.x = other.x;
		this.y = other.y;
		return this;
	}

	subtract(other)
	{
		this.x -= other.x;
		this.y -= other.y;
		return this;
	}
}
