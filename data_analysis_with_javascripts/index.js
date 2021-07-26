// import packages
const dataForge = require('data-forge');require('data-forge-fs')

// Create A DataFrame

const df = new dataForge.DataFrame({
    columnNames:["id","name","sex","age"],
    rows:[
        [1,"Jesse","male",25],
        [2,"Jane","female",25],
        [3,"Mark","male",20],
        [4,"Peter","male",55],
        [5,"Paula","female",35],

    ]
})
console.log(df.toArray())
console.log(df.toString())

// Using a list of objects
let data = [{ A: 1, B: 10 }, { A: 2, B: 20 }, { A: 3, B: 30 }];
let df2 = new dataForge.DataFrame(data);
console.log(df2.toString())

// Reading CSV
// const df = dataForge.readFileSync('data/sodata.csv').parseCSV();

// Display DF
// console.log(df.toArray())

// Display as Rows
// console.log(df.toRows())

// Display as Index and Value Pairs
// console.log(df.toPairs())

// Display as JSON
// console.log(df.toJSON())

// Get Head as a nice format
// console.log(df.head(5).toString())

// Get tail
// console.log(df.tail(5).toString())

// Get Datatypes
// console.log(df.detectTypes().toString())

// Get Values
// console.log(df.detectValues().toString())

// Get Column Names
// console.log(df.getColumnNames())

// Rename a column /make sure to set const to let
// let df2 = df.renameSeries({"title":"text"})
// console.log(df2.getColumnNames())

// SELECTION OF ROWS
// pandas:: df.iloc[10]
// let row10 = df.at(10)
// console.log(row10)

// pandas:: df.loc[10:20]
// console.log(df.between(10,20).toString())

// Using skip and take
// console.log(df.skip(10).take(20).toString())


// SELECTION OF COLUMNS/Same as series
//pandas df['col1'] or df.col1
// method 1: using getSeries
// console.log(df.getSeries("tags").toString())

// method 2: using deflate
// console.log(df.deflate(row=>row.tags).toString())

// method 3: using subset
// console.log(df.subset(['tags','title']).toString())

// Deleting Columns
// console.log(df.dropSeries('tags').head(5).toString())

// Delete Multiple Columns
// console.log(df.dropSeries(['title','tags']).head(5).toArray())

// Filtering 
// console.log(df.where(row=>row['python'] == 0.0).toString())


// Modification/Transform
// console.log(df.transformSeries({title: value => value.toUpperCase()}).toString())

// let pyHeight = df.getSeries("python")
// console.log(pyHeight.select(value=> value + 2.5).toString())
// df.withSeries("Height",pyheight2)

// Groupby
// let sexgroups = df.groupBy(row => row.sex).select(
//     group=>{
//         return{
//             Sex:group.first().sex,
//             Count:group.count()
//         }
//     }
// ).inflate();



// Thanks For Your Time
// Jesus Saves @JCharisTech
// Jesse E.Agbe(JCharis)

