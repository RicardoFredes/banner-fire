/*
  trigger: timeout, scroll, pageout
*/

const content = `
<h2>Banner fire - modal</h2>
<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iure totam incidunt temporibus explicabo dicta! Nostrum modi quibusdam expedita neque eos ea veniam, sapiente repellat tempora provident optio unde recusandae atque!</p>
<button data-banner-fire="close">Fechar</button>
`

class BannerFire {
    constructor(props = {}) {
        this.content = props.content || content
        this.trigger = props.trigger
        this.timeout = props.timeout || 5000
        this.position = props.position
        this.mount()
        this.onTrigger()
    }

    close() {
        this.$el.remove()
    }
    
    mount() {
        this.$el = document.createElement('div')
        this.$el.innerHTML = `
        <div class="banner-fire">
          <div class="banner-fire__overlay">
            <button data-banner-fire="close" class="banner-fire__close-button">
                Close
            </button>
            <div class="banner-fire__content">
                ${this.content}        
            </div>
          </div>
        </div>
        `
        const closeElements = this.$el.querySelectorAll('[data-banner-fire="close"]')
        closeElements.forEach(element => {
            element.onclick = () => this.close()
        })
    }

    open() {
        document.body.appendChild(this.$el)
    }

    onTrigger() {
        switch(this.trigger) {
            case 'timeout':
                return this.onTimeout()
            case 'scroll':
                return this.onScroll()
            case 'pageout':
                return this.onPageout()
            default:
                return
        }
    }

    onTimeout() {
        setTimeout(() => this.open(), this.timeout)
    }

    onScroll() {
        const viewHeight = document.body.clientHeight
        const position = this.position || viewHeight / 3
        const scroll = () => {
            const currentPosition = window.scrollY
            if (currentPosition > position) {
                this.open()
                document.removeEventListener('scroll', scroll)    
            }
        }
        document.addEventListener('scroll', scroll)
        
    }

    onPageout() {
        const mouseMove = (event) => {          
            if (event.movementY < 0 && event.clientY < 50) {
                this.open()
                document.removeEventListener('mousemove', mouseMove)
            }
        }
        setTimeout(() => {
            document.addEventListener('mousemove', mouseMove)
        }, this.timeout)
    }
}