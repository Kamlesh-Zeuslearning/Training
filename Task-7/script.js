class Parent {
    constructor() {
        this.div = document.createElement("div");
        this.div.classList.add("parent");
        this.div.style.position = "relative";
        document.body.appendChild(this.div);
    }
    appendBox(box) {
        this.div.appendChild(box.div);
    }
}

class Box {
    constructor(parent) {
        this.div = document.createElement("div");
        this.div.classList.add("box");
        this.div.id = "box";
        this.div.setAttribute(
            "data-box-id",
            `box-${Math.random().toString(36).substr(2, 9)}`
        );

        parent.appendBox(this);
        this.addDragEventListeners();

        this.offsetX = 0;
        this.offsetY = 0;
    }

    appendTo(element) {
        element.appendChild(this.div);
    }

    addDragEventListeners() {
        this.div.addEventListener("pointerdown", (e) => {
            this.OffsetX = e.clientX - this.div.getBoundingClientRect().left;
            this.OffsetY = e.clientY - this.div.getBoundingClientRect().top;

            this.boundMove = this.pointerMoveHandler.bind(this);
            this.boundUp = this.pointerUpHandler.bind(this);

            document.addEventListener("pointermove", this.boundMove);
            document.addEventListener("pointerup", this.boundUp);
        });
    }

    pointerMoveHandler(e) {
        this.div.style.left = `${e.clientX - this.OffsetX}px`;
        this.div.style.top = `${e.clientY - this.OffsetY}px`;

        // Boundaries check for parent
        const parentRect = this.div.parentElement.getBoundingClientRect();

        if (e.clientX - this.OffsetX <= 0) {
            this.div.style.left = 0;
        } else if (this.div.getBoundingClientRect().right >= parentRect.width) {
            this.div.style.left = `${parentRect.width - this.div.offsetWidth}px`;
        }

        if (e.clientY - this.OffsetY <= 0) {
            this.div.style.top = 0;
        } else if (
            this.div.getBoundingClientRect().bottom >= parentRect.height
        ) {
            this.div.style.top = `${
                parentRect.height - this.div.offsetHeight
            }px`;
        }
    }

    pointerUpHandler(e) {
        document.removeEventListener("pointermove", this.boundMove);
        document.removeEventListener("pointerup", this.boundUp);
    }
}

const parent1 = new Parent();
const box1 = new Box(parent1);

const box2 = new Box(parent1)



window.onresize = () => {
    document.querySelectorAll('.parent').forEach(parent => {
        parent.querySelectorAll('.box').forEach(box => {
            const parentRect = parent.getBoundingClientRect();
            const boxRect = box.getBoundingClientRect();

            if (boxRect.left + boxRect.width > parentRect.width) {
                box.style.left = `${parentRect.width - boxRect.width}px`;
            }
            if (boxRect.top + boxRect.height > parentRect.height) {
                box.style.top = `${parentRect.height - boxRect.height}px`;
            }
        });
    });
};