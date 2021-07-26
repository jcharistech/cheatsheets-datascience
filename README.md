## CheatSheets-DataScience
A collection of cheatsheets,tips,Reference Guide for several data analysis libraries and frameworks
+ Pandas
+ Pyspark
+ Pypolars
+ Dask
+ DataTables
+ etc




### PySpark
+ PySpark is an interface for Apache Spark in Python. It not only allows you to write Spark applications using Python APIs, but also provides the PySpark shell for interactively analyzing your data in a distributed environment. PySpark supports most of Spark’s features such as Spark SQL, DataFrame, Streaming, MLlib (Machine Learning) and Spark Core.
+ https://spark.apache.org/docs/latest/api/python/reference/index.html


#### Installation
```bash
pip install pyspark
```


#### Load PySpark & Launch Spark UI
```python
from pyspark import SparkContext
# Create a Spark Context
sc = SparkContext(master="local[2]")
sc 
```

#### Create Spark Session
```python
from pyspark.sql import SparkSession
# Spark Session used for DF
spark = SparkSession.builder.appName("SampleSparkApp").getOrCreate()
```

#### Basics For Data Analysis

#### Read CSV without header/schema
```python
df = spark.read.csv("data/dataset.csv")
```

#### Preview/Show the first 5 row
```python
df.show(5)
```

#### Read CSV with header
```python
df = spark.read.csv("data/dataset.csv",header=True)
df.show(5)
```

#### Read CSV with header and Infer Schema
```python
df = spark.read.csv("data/dataset.csv",header=True,infer_schema=True)
df.show(5)
```

#### Get First Row
```python
df.first()
```

#### Get First 5 Row using .head
```python
df.head(5)
```

#### Check For the column names
```python
df.columns
```
#### Check For the Datatypes
```python
df.dtypes
```
#### Get the Schema
```python
df.printSchema()
```
##### Check the number of rows
```python
df.count()
```

#### Check for the number of columns
```python
len(df.columns)
```

#### Get the shape (rows,cols)
```python
print(df.count(),len(df.columns))
```

#### Descriptive Summary
```python
df.describe().show()
```

#### Get Descriptive Summary of A Column
```python
df.describe('age').show()
```

### Selection of Columns

```python
df.select('Col1').show()
```
##### Tip Column Selection is irrespective of Case of Column
```python
df.select('COL1').show()
df.select('col1').show()
```

#### Select Multiple columnns
```python
df.select('Age','Category').show()
```

#### Note on Selection
+ Using Bracket notation only prints the name of the column no the data within the column


#### Dot Notation *
```python
df.Age
```


### Conditions & Filter

#### Using filter method

```python
# Method 1: Using Filter
df.filter(df['Age'] == 25).show()
# or
df.filter(df.Age == 25).show()
# Filter on ==,>, <, >=, <= condition
df = df.filter(df.Age > 25)
```


##### Filter using Multiple conditions 
+ It requires parentheses around each condition
```python
df = df.filter((df.Age > 25) & (df.Gender == 'M'))
```
##### Filter against a list of allowed values
```python
df = df.filter(col('first_name').isin([3, 4, 7]))
```

#### Sort By Ascending or Descending Order
```python
df.orderBy(df.age.asc())
df.orderBy(df.age.desc())
```


#### Using where method
```python
# Where: Method 1
df.where(df['sex'] == 'f').show()
# Filter and show only a selected column
df.where(df['sex'] == 'f').select('Age','Sex','Category').show(5)
```

#### Working with Columns
```Python
# Add a Column
df.withColumn('Alb_by_10',df['ALB'] * 10).show()
# Persist the addition
df2 = df.withColumn('Alb_by_10',df['ALB'] * 10)
# Rename a column
df = df.withColumnRenamed('dob', 'date_of_birth')
# Select the columns to keep, optionally rename some
df = df.select(
    'name',
    'age',
    F.col('dob').alias('date_of_birth'),)

# Remove columns
df = df.drop('monthly_salary', 'salary_for_year')

# Keep all the columns which also occur in another dataset
df = df.select(*(F.col(c) for c in df2.columns))

# Batch Rename/Clean Columns
for col in df.columns:
    df = df.withColumnRenamed(col, col.lower().replace(' ', '_').replace('-', '_'))
```










### Pypolars
+ PyPolars is an open-source Python data frame library similar to Pandas. PyPolars utilizes all the available cores of the CPU and hence performs the computations faster
+ Ideally, PyPolars is used when the data is too big for Pandas and too small for Spark
+ https://github.com/pola-rs/polars

#### Pypolars API
+ Eager API: it is very similar to that of Pandas, and the results are produced just after the execution is completed. 
+ Lazy API: it is very similar to Spark, where a map or plan is formed upon execution of a query. Then the execution is executed parallelly across all the cores of the CPU.




#### Installation
```bash
pip install py-polars
```

#### Import Package
```python
import pypolars as pl
```

#### Reading CSV
```python
df = pl.read_csv("data/diamonds.csv")
```

#### Check Type
```python
type(df)
pypolars.frame.DataFrame
```

#### Get First Rows / Head
```python
df.head()
```

#### Get Last 10 Rows
```python
df.tail(10)
```

#### Check For Shape
```python
df.shape
```
#### Check For Datatypes
```python
df.dtypes

[pypolars.datatypes.Float64,
 pypolars.datatypes.Utf8,
 pypolars.datatypes.Utf8,
 pypolars.datatypes.Utf8,
 pypolars.datatypes.Float64,
 pypolars.datatypes.Float64,
 pypolars.datatypes.Int64,
 pypolars.datatypes.Float64,
 pypolars.datatypes.Float64,
 pypolars.datatypes.Float64]

```

#### Check For Column Names
```python
df.columns
```
#### Get Descriptive Summary
```python
# there is no .describe() hence use pandas
df.to_pandas().describe()
```

### Selection of Columns
```python
# Select Columns By Col Name
# same in pandas:: df['carat']
df['col1']

# Select Columns By Index
df[0]

# Select By Index Position for columns
# same in pandas:: df[0] 
df.select_at_idx(0)

# Select Multiple Columns
df[['col1','col2']]
```


#### Selection of Rows
```python
# Select rows 0 to 3 and all columns
# same in pandas:: df.iloc[0:3]
df[0:3]

# Slicing 0 to length of rows
# same in pandas:: df.iloc[0:3]
df.slice(0,3)

# Select from 3 rows of a column
df[0:3,"col1"]

# Select from different rows of a column
df[[0,4,10],"col1"]

# Select from different rows of a multiple columns
df[[0,4,10],["col1","col2"]]

```

#### Value Counts & Unique Values
```python
df['col1'].value_counts()

# Get Unique Values
df['cut'].unique()
```

#### Filter & Conditions
```python
# Boolean Indexing & Condition & Find 
# Find all rows/datapoint with cut as ideal
df[df['cut'] == "Ideal"]

# Check For Price More than A Value (300)
df[df['price'] > 300]

```

#### Applying Functions
```python
# Method 1
df['col1'].apply(round)

# Method 2 Using Lambda
df['col1'].apply(lambda x : round(x))

```

#### Using Lazy Execution
```python
import pypolars.lazy as plazy

```

```python
# Define your fxn
def cust_mapcut_values(s: plazy.Series) -> plazy.Series:
    return s.apply(lambda x: mydict[x])
# Apply Function
output = df.lazy().with_column(plazy.col('cut').map(cust_mapcut_values))

# Execute and Collect Results
output.collect()

```

#### Group By
```python
# same in pandas:: df.groupby('cut')['price'].sum()
df.groupby('cut').select('price').sum()

# Selecting Multiple COlumns From Groupby
df.groupby('cut').select(['price','carat']).sum()

# Select Every Column + Fxn
df.groupby(['cut','color']).select_all().first()

```


#### Create A Series
```python
# Create A Series
x = pl.Series('X',['A','B','C'])
y = pl.Series('Y',[3,5,4])

```

#### Plot with Matplotlib
```python
# Load Data Vis Pkgs
import matplotlib.pyplot as plt
# Bar Chart Using Matplotlib
plt.bar(x,y)

```


### Dask
Dask can parallelise operations equally easily on a computer as on a server. It automatically figures out the cores in a machine and intelligently distributes workload.


#### Installation
```bash
pip install dask 
pip install “dask[complete]”
```


### Data-Forge [Data Analysis with Javascript]
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



#### .
+ Jesus Saves @JCharisTech
+ By Jesse E.Agbe(JCharis)