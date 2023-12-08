import { Vector } from "./utils.js"

class Projectile {
    static radius = 2
    static mass = 1

    constructor(start, end, speed) {
        this.mass = Projectile.mass
        this.position = start
        this.direction = new Vector(end.x - start.x, end.y - start.y)
        this.radius = Projectile.radius

        this.length = this.direction.length()
        this.travelledLength = 0  

        this.direction.normalize()
        this.speed = speed
    }

    tick(game) {
        if (this.explosing) return

        // Gravity
        let force = this.mass * game.ballMass / this.position.distance(game.ballPosition) ** 2
        let forceVector = Vector.sub(game.ballPosition, this.position).normalize().mul(force)
        this.direction.add(forceVector).normalize()

        this.position.add(Vector.mul(this.direction, this.speed))
        this.travelledLength += this.speed

        if (this.position.distance(game.ballPosition) < this.radius + game.ballRadius) {
            this.explosing = true
        } else if (this.travelledLength >= this.length) {
            this.explosing = true
        }
    }

    isFinished() {
        return this.explosed
    }

    draw(context) {
        if (this.explosing) {
            this.radius += 0.5
            
            context.strokeStyle = "#FFFFFFFF"
            context.beginPath()
            context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
            context.stroke()

            if (this.radius >= 50) {
                this.explosed = true
            }
            return
        }

        context.fillStyle = "#FFFFFFFF"
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }
}

export default Projectile