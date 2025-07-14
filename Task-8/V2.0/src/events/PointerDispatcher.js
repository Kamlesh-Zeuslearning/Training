export default class PointerDispatcher {
    constructor() {
        this.handlers = [];
        this.activeHandler = null;

        window.addEventListener("pointerdown", (e) => this.handlePointerDown(e));
        window.addEventListener("pointermove", (e) => this.handlePointerMove(e));
        window.addEventListener("pointerup", (e) => this.handlePointerUp(e));
    }

    /**
     * Register a handler object with optional hitTest and event callbacks.
     * @param {object} handlerObj
     * {
     *   hitTest: (e) => boolean,
     *   onPointerDown: (e) => void,
     *   onPointerMove: (e) => void,
     *   onPointerUp: (e) => void,
     * }
     */
    register(handlerObj) {
        this.handlers.push(handlerObj);
    }

    handlePointerDown(e) {
        for (const handler of this.handlers) {
            if (typeof handler.hitTest === "function" && handler.hitTest(e)) {
                this.activeHandler = handler;
                handler.onPointerDown?.(e);
                break;
            }
        }
    }

    handlePointerMove(e) {
        if (this.activeHandler?.onPointerMove) {
            this.activeHandler.onPointerMove(e);
        }
        else{
            for(const handler of this.handlers){
                if(handler.hitTest(e)){
                    break;
                }
            }
        }
    }

    handlePointerUp(e) {
        if (this.activeHandler?.onPointerUp) {
            this.activeHandler.onPointerUp(e);
            this.activeHandler = null; // clear after interaction ends
        }
    }
}
