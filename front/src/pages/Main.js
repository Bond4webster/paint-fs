import React, {useState} from 'react'
import { useAlert } from 'react-alert'
import axios from 'axios'
import './Main.css'
import {Button} from "../components/Button/Button";
import {Textarea} from "../components/Textarea/Textarea";




export const Main = ()=>{

    const [input,setInput] = useState('')
    const [result,setResult] = useState('')

    const alert = useAlert()

    const sendImport = async ()=>{
        try {
            await axios.get('http://localhost:5000/backend/import').then(res=>{
                setInput(res.data)
            })
        }catch (e) {
            console.log(e)
        }
    }

    const draw = () =>{
        let commandsArr = input.split("\n")
        let locArr = []
        let locRes=''
        for(let i = 0; i<commandsArr.length;i++){
            const arr = commandsArr[i].split(' ')
            switch(commandsArr[i][0]){
                case 'C':
                    locArr= createCanvas(arr[1],arr[2])
                    if(!locArr){
                        alert.show('Incorrect canvas params',{type:'error'})
                        return
                    }
                    locRes+=locArr.reduce((prev,el)=>prev+el.reduce((prev,el)=>prev+el,'')+'\n','')+'\n'
                    break
                case 'L':
                    if(locArr.length===0) {
                        alert.show('Canvas not found',{type:'error'})
                        return
                    }
                    locArr=createLine(arr[1],arr[2],arr[3],arr[4],locArr)
                    if(!locArr){
                        alert.show('Incorrect line params',{type:'error'})
                        return
                    }
                    locRes+=locArr.reduce((prev,el)=>prev+el.reduce((prev,el)=>prev+el,'')+'\n','')+'\n'
                    break
                case 'R':
                    if(locArr.length===0) {
                        alert.show('Canvas not found',{type:'error'})
                        return
                    }
                    locArr=createRect(arr[1],arr[2],arr[3],arr[4],locArr)
                    if(!locArr){
                        alert.show('Incorrect rectangle params',{type:'error'})
                        return
                    }
                    locRes+=locArr.reduce((prev,el)=>prev+el.reduce((prev,el)=>prev+el,'')+'\n','')+'\n'
                    break
                case 'B':
                    if(locArr.length===0) {
                        alert.show('Canvas not found',{type:'error'})
                        return
                    }
                    locArr=createBucketFill(arr[1],arr[2],arr[3],locArr)
                    if(!locArr){
                        alert.show('Incorrect bucket fill params',{type:'error'})
                        return
                    }
                    locRes+=locArr.reduce((prev,el)=>prev+el.reduce((prev,el)=>prev+el,'')+'\n','')+'\n'
                    break
                default:
                    alert.show(`${commandsArr[i][0]} is not a command`,{type:'error'})
                    return
            }
        }
        setResult(locRes)
    }

    const exportTxt = async() =>{
        if(!result){
            alert.show('cant export empty file',{type:'error'})
            return
        }
        try {
            await axios.post('http://localhost:5000/backend/export',{result}).then(res=>{
                alert.show(res.data,{type:'success'})
            })
        }catch (e) {
            console.log(e)
        }
    }

    const createCanvas = (w,h) => {

        let arr = []

        w=w*1+2
        h=h*1+2
        if(w<=2 || h<=2){
            return
        }
        if(isNaN(w)||isNaN(h)){
            return
        }
        for(let i=0;i<h;i++){
            if(i===0 || i===h-1){
                arr.push(new Array(w).fill('-'))
            }else{
                arr.push(new Array(w).fill('|',0,w).fill(' ',1,w-1))
            }
        }
        return arr
    }
    const createLine = (x1,y1,x2,y2,locArr)=>{
        if(x1<=0 || y1<=0){
            return
        }
        if(x1 !== x2 && y1 !== y2){
            return
        }
        x1*=1
        x2*=1
        y1*=1
        y2*=1

        if(isNaN(x1)||isNaN(y1)){
            return
        }
        if(y2>locArr.length-2 || x2>locArr[0].length-2 || x1>x2 ||y1>y2 || !y2) return
        let canvas =  locArr
        if(y1===y2){
            canvas[y2]=canvas[y2].fill('x',x1,x2+1)
            return canvas
        }else if(x1===x2){
            for(let i=y1; i<=y2;i++){
                canvas[i].fill('x',x1,x1+1)
            }
            return canvas
        }else {
            console.log('error')
        }

    }
    const createRect = (x1,y1,x2,y2,locArr)=>{
        if(x1<=0 || y1<=0) return

        x1*=1
        x2*=1
        y1*=1
        y2*=1

        if(isNaN(x1)||isNaN(y1)){
            return
        }
        if(y2>locArr.length-2 || x2>locArr[0].length-2 || x1>x2 ||y1>y2 || !y2) return
        let canvas =  locArr

        for(let i=y1;i<=y2;i++){
            if(i===y1 || i===y2){
                canvas[i].fill('x',x1,x2+1)
            }else {
                canvas[i].fill('x',x1,x2+1)
                canvas[i].fill(' ',x1+1,x2)
            }
        }
        return canvas
    }
    const createBucketFill = (x,y,c,locArr)=>{
        if(x<=0 || y<=0) return

        x*=1
        y*=1

        if(isNaN(x)||isNaN(y) || y>locArr.length-2 || x>locArr[0].length-2 ||c.length>1) return

        let canvas = locArr
        const point = canvas[y][x]
        function bucketItem(canvas,x,y,c){

            if(canvas[y][x]!==point)return
            canvas[y][x]=c
            bucketItem(canvas,x-1,y,c)
            bucketItem(canvas,x+1,y,c)
            bucketItem(canvas,x,y+1,c)
            bucketItem(canvas,x,y-1,c)
        }
        bucketItem(canvas,x,y,c)

        return canvas
    }

    return (
        <div className='Main'>
            <div className="App">
                <div className='inputMain'>
                    <Textarea
                        placeholder="input"
                        type='input'
                        value={input}
                    />
                    <div className='inputLeft'>
                        <Button
                            value='import'
                            onClick={sendImport}
                        />
                        <Button
                            value='draw'
                            onClick={draw}
                        />
                    </div>
                </div>
                <div className='textareaExport'>
                    <Textarea placeholder="output" value={result} type='output'/>
                </div>
                <div className='btnExport'>
                    <Button
                        value='export'
                        onClick={exportTxt}
                    />
                </div>
            </div>
        </div>
    );
}