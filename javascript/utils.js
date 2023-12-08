class Vector {
    constructor(x = 0, y = 0) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    normalize() {
        let l = this.length()
        this.x /= l
        this.y /= l
        return this
    }

    static normalized(vector) {
        return new Vector(vector.x, vector.y).normalize()
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
        return this
    }

    static add(v1, v2) {
        return new Vector(v1.x, v1.y).add(v2)
    }

    sub(vector) {
        this.x -= vector.x
        this.y -= vector.y
        return this
    }

    static sub(v1, v2) {
        return new Vector(v1.x, v1.y).sub(v2)
    }

    mul(number) {
        this.x *= number
        this.y *= number
        return this
    }

    static mul(vector, number) {
        return new Vector(vector.x, vector.y).mul(number)
    }

    distance(vector) {
        let distVector = new Vector(vector.x - this.x, vector.y - this.y)
        return distVector.length()
    }

    static distance(v1, v2) {
        return v1.distance(v2)
    }
}

function clamp(x, min, max) {
    return Math.max(Math.min(x, max), min);
}

export { Vector, clamp }