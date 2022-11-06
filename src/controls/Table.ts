import DOMElement = Phaser.GameObjects.DOMElement;

export class Table {

    element: DOMElement

    onChange: Function

    constructor(protected scene: Phaser.Scene) {

    }

    preload() {
        return this
    }

    create(x: number, y: number, width: number, height: number) {
        const style = `
        width: ${width}px; height: ${height}px; 
        border: 1px solid white;
        color:white;
        `

        // это div содеражщий в себе input
        this.element = this.scene.add.dom(x, y).createFromHTML(` <table style="${style}"></table>`).setOrigin(0, 0);

        this.element.addListener('input')
        this.element.on('input', (e: any) => {
            if (this.onChange) {
                this.onChange(e.target.value)
            }
        })

        return this
    }

    setData(data: string[][]) {
        this.clearTable()

        const tableElement = this.element?.node.firstElementChild as HTMLTableElement

        for (let r = 0; r < data.length; ++r) {
            const row = tableElement.insertRow()
            for (let c = 0; c < data[r].length; ++c) {
                const cell = row.insertCell(c)
                cell.textContent = data[r][c]

                cell.style.border = "1px solid white"
                cell.style.color = "white"

            }
        }

        return this
    }

    clearTable() {
        const tableElement = this.element?.node.firstElementChild as HTMLTableElement

        while (tableElement.rows.length > 0) {
            tableElement.deleteRow(0);
        }

    }


    setOrigin(x?: number, y?: number) {
        this.element?.setOrigin(x, y)
        return this
    }

    setVisible(visible: boolean) {
        this.element?.setVisible(visible)
        return this
    }

    setAlpha(alpha?: number) {
        this.element?.setAlpha(alpha)
        return this
    }

}

