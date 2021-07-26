#### Data Analysis with Javascript - DataForge.js


```js
// import package
const dataForge = require('data-forge');require('data-forge-fs')
```

#### Create A DataFrame
```js
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
```

```js
df.toArray()
```

```js
df.toString()
```

#### Using a list of objects

```js
let data = [{ A: 1, B: 10 }, { A: 2, B: 20 }, { A: 3, B: 30 }];
let df2 = new dataForge.DataFrame(data);
```
```js
df2.toString()
```

#### Reading CSV
```js
const df = dataForge.readFileSync('data/sodata.csv').parseCSV();
```

#### Display DF
```js
df.toArray()
````

#### Display as Rows

```js
df.toRows()
````
#### Display as Index and Value Pairs

```js
df.toPairs()
```

#### Display as JSON
```js
df.toJSON()
```

#### Get Head as a nice format
```js
df.head(5).toString()
```
#### Get tail
```js
df.tail(5).toString()
```

#### Get Datatypes
```js
df.detectTypes().toString()
```

#### Get Values
```js
df.detectValues().toString()
```

#### Get Column Names
```js
df.getColumnNames()
```

#### Rename a column /make sure to set const to let
```js 
let df2 = df.renameSeries({"title":"text"})
df2.getColumnNames()
```
#### SELECTION OF ROWS
+ pandas:: df.iloc[10]
```js
 let row10 = df.at(10)
row10
```
+ pandas:: df.loc[10:20]
```js
df.between(10,20).toString()
```
#### Using skip and take
```js
df.skip(10).take(20).toString()
```

#### SELECTION OF COLUMNS/Same as series
+ pandas df['col1'] or df.col1

#### method 1: using getSeries
```js
df.getSeries("tags").toString()
```
#### method 2: using deflate
```js
df.deflate(row=>row.tags).toString()
```

#### method 3: using subset
```js
df.subset(['tags','title']).toString()
```
#### Deleting Columns
```js
df.dropSeries('tags').head(5).toString()
```

#### Delete Multiple Columns
```js
df.dropSeries(['title','tags']).head(5).toArray()
```

#### Filtering 
```js
df.where(row=>row['python'] == 0.0).toString()
```

#### Modification/Transform
```js
df.transformSeries({title: value => value.toUpperCase()}).toString()
```

####  Method 2
```js
let pyHeight = df.getSeries("python")
pyHeight.select(value=> value + 2.5).toString()

df.withSeries("Height",pyheight2)
```
#### Groupby
``` let sexgroups = df.groupBy(row => row.sex).select(
     group=>{
         return{
             Sex:group.first().sex,
             Count:group.count()
         }
     }).inflate();
```



#### Thanks For Your Time
+ Jesus Saves @JCharisTech
+ Jesse E.Agbe(JCharis)

