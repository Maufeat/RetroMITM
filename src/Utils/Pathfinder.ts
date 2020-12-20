/*import Cell from "../Map/Cell"
import Map from "../Map/Map"

export default class Pathfinder{

    static get_Pathfinding_Limpio(cells: Cell[]): string{
        return ""
    }

    static getPath(startCell: Cell, targetCell: Cell, celdas_no_permitidas: Cell[], detener_delante = false, distancia_detener = 0){
        if(startCell == targetCell)
            return []
        
        let allowedCells = [ startCell ]

        if(celdas_no_permitidas.includes(targetCell))
            celdas_no_permitidas.splice(celdas_no_permitidas.indexOf(targetCell), 1)
        
        while (allowedCells.length > 0){
            let index = 0
            for(let i = 1; i < allowedCells.length; i++){
                if(allowedCells[i].coste_f < allowedCells[index].coste_f)
                    index = i
                if(allowedCells[i].coste_f == allowedCells[index].coste_f){
                    if(allowedCells[i].coste_g > allowedCells[index].coste_g)
                        index = i
                    if(allowedCells[i].coste_g == allowedCells[index].coste_g)
                        index = i
                }
            }
            let actual = allowedCells[index]

            if(actual == targetCell)
                return this.getCaminoRetroceso(startCell, actual)

            allowedCells.splice(allowedCells.indexOf(actual), 1)
            celdas_no_permitidas.push(actual)

            let get
        }
    }

    static getAdjacencyCells(cell: Cell, map: Map): Cell[]{
        let adjacencyList: Cell[] = []

        //let cell_derecha = map.cells.find(nodec => nodec.x == nodo.x + 1 && nodec.y == nodo.y))

        return adjacencyList
    }

    static getCaminoRetroceso(startCell: Cell, finalCell: Cell): Cell[]{
        let currentCell = finalCell
        let celdas_camino = []
        while(currentCell != startCell){
            celdas_camino.push(currentCell)
            if(currentCell.parentNode != null)
                currentCell = currentCell.parentNode
        }
        celdas_camino.push(startCell)
        return celdas_camino.reverse()
    }

    /*
        private List<Cell> get_Camino_Retroceso(Cell nodo_inicial, Cell nodo_final)
        {
            Cell nodo_actual = nodo_final;
            List<Cell> celdas_camino = new List<Cell>();

            while (nodo_actual != nodo_inicial)
            {
                celdas_camino.Add(nodo_actual);
                nodo_actual = nodo_actual.parentNode;
            }

            celdas_camino.Add(nodo_inicial);
            celdas_camino.Reverse();

            return celdas_camino;
        }
    

}*/