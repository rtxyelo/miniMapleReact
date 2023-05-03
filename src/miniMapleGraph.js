import React from 'react';
import * as d3 from 'd3';

class MiniMapleGraph extends React.Component {
    
    graph(exp, variable){
        // Удаление всех элементов находящихся в группе svg
        d3.select("#graph").selectAll("*").remove();
        // Convention: https://bl.ocks.org/mbostock/3019563
        const margin = { top: 10, right: 50, bottom: 50, left: 50 },
          width = 450 - margin.left - margin.right,
          height = 350 - margin.top - margin.bottom;
  
        const svg = d3.select("#graph").attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        // Define chart area
        svg
          .append("clipPath")
          .attr("id", "chart-area")
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", width)
          .attr("height", height)
  
        // Add Axes
        const xMax = 5;
        const yMax = 5;
  
        let xScale = d3.scaleLinear([-xMax, xMax], [0, width])
        let yScale = d3.scaleLinear([-yMax, yMax], [height, 0])
  
        let xAxis = d3.axisBottom(xScale)
        let yAxis = d3.axisLeft(yScale)
        svg.append("g")
          .attr("transform", `translate(0,${height/2})`)
          .call(xAxis)
        svg.append("g")
          .attr("transform", `translate(${width/2},0)`)
          .call(yAxis)
  
        // Axes label
        svg.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "end")
          .attr("x", width / 2 + 5)
          .attr("y", height + 35)
          .text("x");
  
        svg.append("text")
          .attr("class", "y label")
          .attr("text-anchor", "end")
          .attr("y", -35)
          .attr("x", -height / 2)
          .attr("transform", "rotate(-90)")
          .html("y")
  
        function f(exp, variable, eqvariable) {
          let res = 0
          let derivTerm = 0
          const [listOfSigns, listOfTerms] = getListOfTermsAndSigns(exp)
          for (let i = 0; i < listOfTerms.length; i++) {
              derivTerm = getGraphFromTerm(listOfTerms[i], variable, eqvariable)
              //console.log(derivTerm)
              if (derivTerm === 0) {
                  continue
              }
              if (listOfSigns[i] === "+") {
                res += derivTerm
              }
              else {
                res -= derivTerm
              }
          }
          
          return res
        }
  
        function graphFunction() {
          let pointNum = 10;
  
          const data = [];
          for (let x = -pointNum; x <= pointNum; x++) {
            let y = f(exp, variable, x);
            data.push([x, y])
          }
          return data;
        }
  
        // Add function graph
        let line = d3.line()
          .x(d => xScale(d[0]))
          .y(d => yScale(d[1]))
        svg.append("path")
          .datum(graphFunction())
          .attr("clip-path", "url(#chart-area)")
          .attr("fill", "none")
          .attr("stroke", "teal")
          .attr("stroke-width", 2)
          .attr("d", line);
  
          graphFunction();
      }
}

function getGraphFromTerm(term, variable, eqvariable) {
    let res = 0
    const regex1 = new RegExp(`(\\d+)?\\*?(\\w)?(?:\\^(\\d+))?`);
    const matches = term.match(regex1)
    //console.log(matches)
    if (matches !== null) {
        let mult = 1
        if ((matches[1] !== undefined) && (matches[2]===undefined || matches[2]===variable)) {
            mult = Number(matches[1])
            //console.log(mult)
            res = mult
        }
        let power = 1
        if (matches[3] !== undefined) {
            power = Number(matches[3])
        }
        if (matches[2]===variable) {
          res = mult * eqvariable**power  
        }
        //console.log("mult:", mult, "power:", power, "variable:", variable)
    }
    return res
  }

function getListOfTermsAndSigns(exp) {
    let tmp = ""
    exp = '+' + exp.replace(/\s/g, '');
    let listOfTerms = []
    let allowedSymbols = '+-^1234567890abcdefghijklmnopqrstuvwxyz'.split('');
    let listOfSigns = []
    let firstSign = true
    for (let i = 0; i < exp.length; i++) {
        if (!allowedSymbols.includes(exp[i])) {
            throw new Error("wrong symbol in input!"+exp[i])
        }
        if (exp[i]==="+" || exp[i] ==="-") {
            listOfSigns.push(exp[i])
            if (firstSign){
                firstSign = false
                continue
            }
            listOfTerms.push(tmp)
            tmp = ""
            continue
        }
        tmp += exp[i]
    }
    listOfTerms.push(tmp)
    return [listOfSigns, listOfTerms]
}

export {MiniMapleGraph}
