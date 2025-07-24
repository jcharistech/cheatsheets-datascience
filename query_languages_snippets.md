# A Collection of Query Language Snippets
+ SQL
+ Cypher Graph Language
+ GraphQL

# SQL (Structured Query Language)
+ SQL is a standard language for relational databases; specific dialects (MySQL, PostgreSQL, SQL Server, SQLite, Oracle) may vary in functions and syntax for certain features.
---

## Core SQL Syntax and Concepts

### 1. **Basic SELECT Queries**

- Select all columns:  
  `SELECT * FROM table_name;`
- Select specific columns:  
  `SELECT column1, column2 FROM table_name;`
- Select with alias:  
  `SELECT column1 AS alias_name FROM table_name;`

### 2. **WHERE Clause (Filtering)**

- Basic equality:  
  `SELECT * FROM employees WHERE age = 30;`
- Multiple conditions:  
  `SELECT * FROM employees WHERE age > 25 AND department = 'HR';`
- Pattern matching:  
  `SELECT * FROM users WHERE name LIKE 'A%';`
- Set membership:  
  `SELECT * FROM products WHERE id IN (1, 2, 3);`
- Nulls:  
  `SELECT * FROM customers WHERE email IS NULL;`

### 3. **ORDER BY, LIMIT/OFFSET**

- Sort results:  
  `SELECT * FROM orders ORDER BY order_date DESC;`
- Limit number of rows:  
  `SELECT * FROM users LIMIT 10;`
- Skip rows:  
  `SELECT * FROM users OFFSET 5 LIMIT 10;`  

### 4. **INSERT (Add Data)**

- Insert one row:  
  `INSERT INTO products (name, price) VALUES ('Apple', 1.99);`
- Insert multiple rows:  
  `INSERT INTO products (name, price) VALUES ('Banana', 0.99), ('Cherry', 2.99);`

### 5. **UPDATE (Modify Data)**

- Update specific rows:  
  `UPDATE employees SET salary = salary * 1.05 WHERE department = 'Sales';`
- Update all rows (use with care):  
  `UPDATE employees SET active = 1;`

### 6. **DELETE (Remove Data)**

- Delete specific rows:  
  `DELETE FROM products WHERE price  (SELECT AVG(salary) FROM employees);`
- IN/EXISTS:  
  `SELECT name FROM employees WHERE department_id IN (SELECT id FROM departments WHERE active = 1);`

### 10. **UNION / UNION ALL**

- Combine results:  
  `SELECT name FROM table1 UNION SELECT name FROM table2;`
- With duplicates:  
  `SELECT name FROM table1 UNION ALL SELECT name FROM table2;`

### 11. **Table and Schema Management**

- Create table:  
  ```
  CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Alter table:  
  `ALTER TABLE users ADD last_login TIMESTAMP;`
- Drop table:  
  `DROP TABLE users;`

### 12. **Indexes & Constraints**

- Create index:  
  `CREATE INDEX idx_name ON users(name);`
- Add unique:  
  `ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);`
- Foreign key:  
  `ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id);`

### 13. **Best Practices**

- Always back up before running bulk UPDATE or DELETE.
- Add appropriate WHERE clauses to avoid unintentional data loss.
- Use parameterized queries (e.g., with `?` or `$1` placeholders) to prevent SQL injection.
- Use EXPLAIN to check query plans for performance optimization.

---

## Example Queries

| Task                          | Query Example                                                                            |
|-------------------------------|------------------------------------------------------------------------------------------|
| Employees over 40             | SELECT * FROM employees WHERE age > 40;                                                   |
| Top 5 products by sales       | SELECT product_id, SUM(quantity) FROM sales GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 5; |
| Customers without orders      | SELECT c.* FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;            |
| Number of active users        | SELECT COUNT(*) FROM users WHERE active = 1;                                              |
| Departments with >10 employees| SELECT department_id FROM employees GROUP BY department_id HAVING COUNT(*) > 10;           |

---






# Cypher
+ This covers creation, querying, updating, and deletion of nodes and relationships, including advanced tips. Cypher aims for expressiveness and visual clarity, resembling the patterns in your graph.

---

## Core Cypher Syntax and Concepts

### 1. **Nodes**

- Basic node: `(n)`
- Node with label: `(n:Label)`
- Node with properties: `(n:Label {key: 'value'})`
- Example: `(:Person {name: 'Alice', age: 32})`

### 2. **Relationships**

- Basic: `()-[]->()`
- With type: `()-[:TYPE]->()`
- With properties: `()-[:TYPE {prop: 'val'}]->()`
- Direction: `()-[:TYPE]->()`, `(b:Person) RETURN a, b`

### 4. **CREATE (Adding Data)**

- Node: `CREATE (n:Person {name: 'Bob'})`
- Relationship: 
  ```
  MATCH (a:Person {name: 'Alice'}), (b:Person {name: 'Bob'})
  CREATE (a)-[:KNOWS]->(b)
  ```
- Multiple nodes/relationships:
  `CREATE (a:Person {name: 'Alice'})-[:FRIEND]->(b:Person {name: 'Bob'})`

### 5. **DELETE (Removing Data)**

- Node (must detach relationships): 
  ```
  MATCH (n:Person {name: 'Bob'}) DETACH DELETE n
  ```
- Delete specific relationship:
  ```
  MATCH (a)-[r:FRIEND]->(b) DELETE r
  ```

### 6. **UPDATE (SET, REMOVE, MERGE)**

- Add/update property: 
  ```
  MATCH (n:Person {name: 'Alice'}) SET n.age = 33
  ```
- Remove property:
  ```
  MATCH (n:Person) REMOVE n.age
  ```
- Add label:
  ```
  MATCH (n:Person) SET n:Employee
  ```
- MERGE (get or create):
  ```
  MERGE (n:Person {name: 'Carol'})
  ```

### 7. **WHERE Clause (Filtering)**

- By property: `WHERE n.age > 30`
- By label: `WHERE n:Person`
- Logical: `WHERE n.age > 30 AND n.name = 'Alice'`
- Pattern: `MATCH (a)-[:FRIEND]->(b) WHERE a.name = 'Alice' RETURN b.name`

### 8. **RETURN (What to Output)**

- All nodes and relationships: `RETURN n, r`
- Only single property: `RETURN n.name`
- Expression: `RETURN n.name + ' is ' + n.age`
- Distinct: `RETURN DISTINCT n.name`

### 9. **ORDER BY, LIMIT, and SKIP**

- Sort: `ORDER BY n.age DESC`
- Limit number: `LIMIT 10`
- Skip n results: `SKIP 5 LIMIT 10`

### 10. **Aggregations**

- Count: `RETURN count(n)`
- Collect: `RETURN collect(n.name)`
- Group by: `RETURN n.age, count(*)`

### 11. **Advanced Pattern Matching**

- Variable length: `MATCH (a)-[:FRIEND*1..3]->(b)`
- Shortest path:
  ```
  MATCH p = shortestPath((a:Person)-[:FRIEND*]-(b:Person)) RETURN p
  ```
- Find cycles: `MATCH path=(n)-[*]-(n) RETURN n, length(path)`[1]
- Not connected: 
  ```
  MATCH n, m 
  WHERE NOT (n)-[]->(m) 
  RETURN n, m
  ```

### 12. **Indexes and Constraints**

- Create index: `CREATE INDEX FOR (n:Person) ON (n.name)`
- Uniqueness constraint: `CREATE CONSTRAINT ON (n:User) ASSERT n.email IS UNIQUE`

### 13. **Parameters and Efficiency**

- Use parameters: `MATCH (n:Person {name: $name}) RETURN n`
- Analyze queries: `EXPLAIN `, `PROFILE `
- Limit result size for efficiency: `LIMIT 100`

### 14. **Bulk Import**

- Load CSV:
  ```
  LOAD CSV WITH HEADERS FROM 'file:///file.csv' AS row
  CREATE (n:Person {name: row.name})
  ```
[3]

---

## Example Queries

| Purpose                       | Query Example                                                                                         |
|-------------------------------|-------------------------------------------------------------------------------------------------------|
| Find friends of Alice         | MATCH (a:Person {name: 'Alice'})-[:FRIEND]->(friends) RETURN friends.name                             |
| Find all movies and directors | MATCH (m:Movie)<-[:DIRECTED]-(d:Director) RETURN m.title, d.name                                     |
| Count relationships           | MATCH (n)-[r]-() RETURN type(r), count(*)                                                            |
| Delete node (with relations)  | MATCH (n {name: 'Obsolete'}) DETACH DELETE n                                                         |
| String concatenation          | RETURN n.name + ' and ' + m.name                                                                     |

---

## Pro Tips

- **Think visually!** Cypher's ASCII-art patterns represent your graph logic.
- **Use labels and property selectors** to help Neo4j optimize queries.
- **Use EXPLAIN/PROFILE** to diagnose performance.
- **Prefer MERGE only when necessary**—it can be slower than CREATE/UPDATE for large datasets.
- **Parameterize queries** for safety and reusability.
- **Large data imports:** Use `LOAD CSV` for efficiency.

---


# Graph QL


---

## Core GraphQL Syntax and Concepts

### 1. **Operation Types**

- **Query:** Fetch (read) data from the server.
- **Mutation:** Modify (create, update, delete) data on the server.
- **Subscription:** (Advanced; not covered here) Real-time updates.

### 2. **Basic Query Structure**

- With operation name:
  ```graphql
  query GetUser {
    user(id: 1) {
      name
      email
    }
  }
  ```
- Operation name is optional. You may also write:
  ```graphql
  {
    user(id: 1) {
      name
      email
    }
  }
  ```
  The outer braces and field selection mirror the structure of your desired data.

### 3. **Selection Sets and Nested Data**

- You specify exactly the fields you want returned:
  ```graphql
  {
    post(id: 10) {
      title
      author {
        name
      }
      comments {
        text
      }
    }
  }
  ```
  This requests just `title`, `author.name`, and each `comment.text`.

### 4. **Arguments (Parameters)**

- Pass arguments to root or nested fields:
  ```graphql
  {
    todos(limit: 10) {
      id
      title
    }
  }
  ```
  - Multiple arguments:
    ```graphql
    {
      users(limit: 1) {
        id
        name
        todos(order_by: {created_at: desc}, limit: 5) {
          id
          title
        }
      }
    }
    ```

### 5. **Aliasing**

- Use aliasing to fetch the same field with different arguments or to change the field key in the result:
  ```graphql
  {
    post1: post(id: 1) { title }
    post2: post(id: 2) { title }
  }
  ```

### 6. **Fragments (Reusability)**

- Fragments allow you to reuse field selections:
  ```graphql
  fragment userFields on User {
    id
    name
    email
  }

  query {
    users {
      ...userFields
      posts {
        id
        title
      }
    }
  }
  ```

### 7. **Variables (Dynamic Inputs)**

- Replace hard-coded values with variables for reuse and security:
  ```graphql
  query GetUser($userId: Int!) {
    user(id: $userId) {
      name
      email
    }
  }
  ```
  - When calling the query, provide variables as JSON:
    ```json
    { "userId": 5 }
    ```
  This approach is considered best practice for user input.

### 8. **Mutations**

- Structure is similar to queries, but using the `mutation` keyword:
  ```graphql
  mutation CreateUser($name: String!, $email: String!) {
    createUser(name: $name, email: $email) {
      id
      name
    }
  }
  ```
  - For updates and deletes, field names and arguments depend on your schema.

### 9. **Directives**

- Special keywords that provide conditional logic:
  ```graphql
  query getUser($withEmail: Boolean!) {
    user(id: 5) {
      name
      email @include(if: $withEmail)
    }
  }
  ```
  Directives like `@include` and `@skip` control field inclusion.

---

## Example GraphQL Queries

| Purpose                      | Example                                                                                                  |
|------------------------------|----------------------------------------------------------------------------------------------------------|
| Get user and posts           | `{ user(id:1) { name, posts { title } } }`                                                               |
| List comments by filter      | `query($postId: ID!){ comments(postId: $postId) { id, text } }`                                          |
| Alias with multiple queries  | `{ primary: user(id:1){name} secondary: user(id:2){name} }`                                              |
| Use fragment                 | `fragment postFields on Post { id title } query{ posts {...postFields} }`                                |
| Conditional field            | `query($showName: Boolean!){ user(id:1){ name @include(if: $showName), age } }`                         |
| Mutation (create)            | `mutation{ createUser(name:"Sam",email:"s@a.com"){id name} }`                                            |
| Nested query with arguments  | `{ users(limit:1) { id name todos(order_by: {created_at: desc}, limit: 5) { id title } } }`              |

---

## Pro Tips

- **Only request what you need:** GraphQL lets you avoid over-fetching and under-fetching.
- **Use variables:** Always separate user input from query text for reusability and safety.
- **Fragments:** Help avoid repeating large field sets, especially with deeply nested structures.
- **Directives:** Use for conditional client requests (`@include`, `@skip`).
- **Check schema docs:** Each GraphQL API may define different queries, mutations, and argument lists.

---

GraphQL syntax is standardized, but query/mutation names and arguments depend on your server’s schema. Always examine GraphQL schema documentation for details on available types, queries, and mutations.*

# NoSQL - MongoDB

**MongoDB’s Query Language (MQL)**, defines how you query, manipulate, and aggregate data in MongoDB collections. The syntax uses *JSON-like documents* and a flexible operator system, distinct from SQL and tailored for semi-structured, document-oriented data.

---

## Core MongoDB Query Syntax (MQL)

### 1. **Finding Documents**

Basic queries use `db.collection.find(query, projection)`:

- **Find all**  
  ```js
  db.users.find()
  ```

- **Equality**  
  ```js
  db.users.find({ age: 25 })
  ```

- **Comparison Operators**  
  ```js
  db.users.find({ age: { $gt: 20, $lt: 30 } })
  ```
  - `$eq` = equals
  - `$ne` = not equals
  - `$gt` = greater than
  - `$lt` = less than
  - `$gte`, `$lte` = greater/less or equal

- **Logical Operators**  
  ```js
  db.users.find({
    $and: [ { age: { $gte: 18 } }, { isActive: true } ]
  })
  db.users.find({
    $or: [ { city: "London" }, { city: "Paris" } ]
  })
  db.users.find({
    $nor: [ { city: "London" }, { city: "Paris" } ]
  })
  db.users.find({
    $not: { score: { $gt: 90 } }
  })
  ```[3][4]

- **IN / NOT IN**  
  ```js
  db.products.find({ category: { $in: ["book", "magazine"] } })
  db.products.find({ status: { $nin: ["obsolete", "discontinued"] } })
  ```

- **Regular Expressions**  
  ```js
  db.users.find({ name: /john/i }) // name contains "john", case-insensitive
  db.users.find({ occupation: /^host/ }) // starts with "host"
  ```[1]

- **Projections (field selection)**  
  ```js
  db.users.find({}, { name: 1, email: 1, _id: 0 })
  ```

- **Sorting and Limiting**  
  ```js
  db.posts.find().sort({ date: -1 }).limit(5)
  db.posts.find().skip(10).limit(5)
  ```[1]

---

### 2. **Inserting Documents**

- **Single Insert:**  
  ```js
  db.users.insertOne({ name: "Alice", age: 28 })
  ```
- **Multiple Insert:**  
  ```js
  db.users.insertMany([    { name: "Bob", age: 35 },
    { name: "Carol", age: 22 }
  ])
  ```

---

### 3. **Updating Documents**

- **Update with `$set`, `$unset`, `$inc`, `$push`, etc.:**
  ```js
  db.users.updateOne({ name: "Alice" }, { $set: { age: 29 } })
  db.users.updateMany({ status: "inactive" }, { $unset: { lastLogin: "" } })
  db.products.updateOne({ name: "Widget" }, { $inc: { stock: 10 } })
  db.users.updateOne({ name: "John" }, { $push: { tags: "newbie" } })
  ```
- **Array Modifiers:**  
  Use `$each`, `$position`, `$slice`, `$sort` with `$push` for advanced array updates[3].

---

### 4. **Deleting Documents**

- **Delete one:**  
  ```js
  db.users.deleteOne({ name: "Alice" })
  ```
- **Delete many:**  
  ```js
  db.logs.deleteMany({ type: "debug" })
  ```

---

### 5. **Aggregation Framework**

For analytics and data transformations:

```js
db.orders.aggregate([  { $match: { status: "complete" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 5 }
])
```
Common stages: `$match` (filter), `$group` (aggregation), `$sort`, `$project` (reshape output), `$limit`, `$unwind` (array flatten), among others[3][4].

---

### 6. **Common Operators**

| Type         | Operator      | Example Usage                                  |
|--------------|--------------|------------------------------------------------|
| Comparison   | `$eq`, `$gt`,`$lt`, `$in`   | `{ age: { $lt: 30 } }`   |
| Logical      | `$and`, `$or`, `$not`        | `{ $or: [A, B] }`        |
| Element      | `$exists`                    | `{ phone: { $exists: true } }` |
| Array        | `$all`, `$size`, `$elemMatch`| `{ tags: { $all: ["js", "db"] } }` |
| Type         | `$type`                      | `{ score: { $type: "int" } }` |
| Regex        | Regular Expression           | `{ name: /regex/ }`      |

---

### 7. **Indexing and Schema**

- **Create Index:**  
  ```js
  db.users.createIndex({ email: 1 }, { unique: true })
  ```

- **No enforced schema:**  
  Collections are *schemaless* but structure is usually enforced at the application or ODM level (e.g., Mongoose).

---

## Example Query Mappings: SQL → MongoDB

| SQL                                      | MongoDB                                 |
|------------------------------------------|-----------------------------------------|
| SELECT * FROM users WHERE age > 30       | db.users.find({ age: { $gt: 30 } })    |
| SELECT name FROM users WHERE id=123      | db.users.find({ _id: 123 }, { name: 1 })|
| SELECT * FROM posts ORDER BY date DESC   | db.posts.find().sort({ date: -1 })     |
| DELETE FROM logs WHERE type='debug'      | db.logs.deleteMany({ type: "debug" })  |
| UPDATE users SET age=40 WHERE name='Bob' | db.users.updateOne({ name: "Bob" }, { $set: { age: 40 } }) |

---

## Pro Tips

- **Query filters and updates use JSON-like documents.**
- **Fields can be nested and arrays are first-class citizens.**
- **Aggregation pipelines enable advanced analytics and transformations.**
- **Indexes are critical for performance on filter and sort fields.**
- Use `$regex` for flexible string matching, but avoid on large unindexed fields for performance.
- **MongoDB is schemaless**; 

### 8. **Working with Embedded/Nested Documents**

- **Query fields in embedded documents:**
  ```js
  // Find users where address.city is 'London'
  db.users.find({ "address.city": "London" })
  ```

- **Update nested fields:**
  ```js
  db.users.updateOne(
    { name: "Alice" },
    { $set: { "address.zip": "12345" } }
  )
  ```

---

### 9. **Array Queries**

- **Match array element by value:**
  ```js
  db.posts.find({ tags: "mongodb" })
  ```
  // Any document where 'tags' array includes "mongodb"

- **Match element by conditions ($elemMatch):**
  ```js
  db.orders.find({
    items: { $elemMatch: { productId: "A100", qty: { $gte: 2 } } }
  })
  ```

- **Array length ($size):**
  ```js
  db.products.find({ tags: { $size: 3 } })
  ```

---

### 10. **Distinct Values**

Get distinct values for a field:
```js
db.users.distinct("city")
```

---

### 11. **Counting Documents**

Count documents matching a query:
```js
db.orders.countDocuments({ status: "pending" })
```

---

### 12. **Text Search**
Enable full-text search with a text index:
```js
db.articles.createIndex({ content: "text" })
db.articles.find({ $text: { $search: "mongodb aggregation" } })
```

---

### 13. **Transaction Support (Replica Set/Cluster)**

Basic example for multi-document ACID transaction:
```js
const session = db.getMongo().startSession();
session.startTransaction();
try {
  db.accounts.updateOne({ _id: "A" }, { $inc: { balance: -100 } }, { session });
  db.accounts.updateOne({ _id: "B" }, { $inc: { balance: +100 } }, { session });
  session.commitTransaction();
} catch (e) {
  session.abortTransaction();
}
session.endSession();
```
*(Requires replica set or sharded cluster)*

---

### 14. **Aggregation Example (Date, Group, Match, Project)**

```js
db.sales.aggregate([  { $match: { date: { $gte: ISODate("2025-01-01") } } },
  { $group: { _id: "$product", total: { $sum: "$quantity" } } },
  { $sort: { total: -1 } },
  { $project: { product: "$_id", total: 1, _id: 0 } }
])
```

---

### 15. **Schema Validation (Optional, MongoDB ≥3.2)**

MongoDB remains by default schemaless, but optional validation rules can be set at collection level:
```js
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "email" ],
      properties: {
        name: { bsonType: "string" },
        email: { bsonType: "string" },
        age: { bsonType: "int", minimum: 0 }
      }
    }
  }
})
```

---

## Additional References & Documentation

- [MongoDB Official Docs – CRUD Operations](https://www.mongodb.com/docs/manual/crud/)
- [MongoDB Aggregation Pipeline Guide](https://www.mongodb.com/docs/manual/aggregation/)
- [Comparison/query operator docs](https://www.mongodb.com/docs/manual/reference/operator/query/)

---

## Summary Table

| Action                    | Example                                                |
|---------------------------|--------------------------------------------------------|
| Find                      | `db.coll.find({ field: value })`                       |
| Insert                    | `db.coll.insertOne({ field: val })`                    |
| Update                    | `db.coll.updateOne({ _id: id }, { $set: { f: v } })`   |
| Delete                    | `db.coll.deleteMany({ field: val })`                   |
| Distinct Values           | `db.coll.distinct("field")`                            |
| Text Search               | `db.coll.find({ $text: { $search: "txt" } })`          |
| Count                     | `db.coll.countDocuments({ field: val })`               |
| Aggregation               | See `$group`, `$sort`, `$project`, etc. above          |

---

## Pro Tips (Continued)
- Prefer `countDocuments()` over deprecated `count()`.
- Use projections or `.limit()` to avoid large result set loads.
- Index queries for speed (especially search/sort fields).
- For application-level data validation, consider Mongoose or native schema validation where required.

---

**Remember:** MongoDB is optimized for flexibility—embrace its operators and pipelines for expressive queries and transformations!



# Redis
+ Redis, by default, is a key-value database with specialized data structures; advanced querying requires modules like RediSearch. This sheet covers both the RediSearch query language and essential Redis data queries.

---

## Redis Query Syntax (RediSearch)

RediSearch introduces a rich, SQL-like search capability using its own query language for complex filtering, text search, and aggregation[1][2].

### **1. Query Basics**

- **AND (intersection)**
  ```
  hello world
  ```
  Returns documents containing both 'hello' AND 'world'.

- **OR (union)**
  ```
  hello|world
  ```
  Returns documents containing 'hello' OR 'world'.

- **NOT (negation)**
  ```
  hello -world
  ```
  Returns documents containing 'hello' but NOT 'world'.

- **Exact Phrase**
  ```
  "hello world"
  ```
  Returns documents containing exactly "hello world".

- **Parenthesis for grouping**
  ```
  (hello|hi) (world|earth)
  ```
  Combines AND/OR with grouping.

### **2. Field-Specific Search**

- Specify the field to search in:
  ```
  @title:"Redis cheatsheet"
  @author:john
  ```
  Searches the value only within the specified field.

### **3. Numeric and Range Queries**

- **Equality:**   `@price:100`
- **Range (inclusive):**   `@price:[10 200]`
- **Greater or equal:**   `@price:[10 +inf]`
- **Greater than:**   `@price:[(10 +inf]`
- **Less or equal:**   `@age:[-inf 30]`
- **Less than:**   `@age:[-inf (30]`
- **Between:** `@score:[70 80]`
- **Out-of-range (OR):** `@age:[-inf (18] | @age:[(65 +inf]`

### **4. List/Set (IN/NOT IN) Queries**

- **IN:**   `@category:(book|magazine|journal)`
- **NOT IN:**   `-@type:(audio|video)`[1]

### **5. Wildcard and Prefix Matching**

- **Prefix Query:**   `@name:jo*`
- **Wildcard anywhere:** Not supported; prefix only.
- **Exact string with spaces:** Wrap in quotes: `@city:"New York"`

### **6. Optional/Weighted Terms**

- Terms prefixed with `~` are optional; more matches, higher ranking:
  ```
  redis ~cache ~nosql
  ```

### **7. Mapping to SQL (Reference)**

| SQL Condition                  | Redis Query                                    |
|------------------------------|------------------------------------------------|
| WHERE x='foo' AND y='bar'    | `@x:foo @y:bar`                                |
| WHERE x='foo' OR y='bar'     | `(@x:foo) | (@y:bar)`                          |
| WHERE x IN ('foo','bar')     | `@x:(foo|bar)`                                 |
| WHERE y='foo' AND x NOT IN   | `@y:foo (-@x:foo) (-@x:bar)`                   |
| WHERE num BETWEEN 10 AND 20  | `@num:[10 20]`                                 |
| WHERE name LIKE 'john%'      | `@name:john*`                                  |

---

## Redis Command Query Cheatsheet

### **1. Basic Key Lookup**

- Get/set value:   
  ```
  GET mykey
  SET mykey "Hello"
  ```
- Key exists:  
  ```
  EXISTS mykey
  ```
- Delete key:   
  ```
  DEL mykey
  ```
- Pattern search for keys:
  ```
  KEYS user:*
  ```

### **2. List Operations**

- Add to list:  
  ```
  LPUSH mylist "item"
  RPUSH mylist "item"
  ```
- Get range of list:  
  ```
  LRANGE mylist 0 -1
  ```

### **3. Hash Operations**

- Set fields:  
  ```
  HSET user:100 name "John" age 21
  ```
- Get all fields:  
  ```
  HGETALL user:100
  ```

### **4. Set Operations**

- Add member(s):  
  ```
  SADD tags redis nosql
  ```
- Membership test:  
  ```
  SISMEMBER tags redis
  ```

### **5. Sorted Set Operations**

- Add with score:  
  ```
  ZADD scores 100 "Alice" 80 "Bob"
  ```
- Range by score:  
  ```
  ZRANGEBYSCORE scores 80 100
  ```

---

## Sample RediSearch Queries

| Purpose                           | Example                                           |
|------------------------------------|---------------------------------------------------|
| Exact author in title/field        | `@author:Smith @title:"databases 2025"`           |
| Age between 21 and 30             | `@age:[21 30]`                                    |
| Name starts with "Jo"             | `@name:jo*`                                       |
| Title is "AI" but not "ML"        | `@title:AI -@title:ML`                            |
| Find NOT in category "old"        | `-@category:old`                                  |
| Score > 90 or score < 70          | `@score:[(90 +inf] | @score:[-inf (70]`           |

---

## Pro Tips

- **Field prefixes are required** for complex searches: always use `@field:value` syntax for clarity.
- **Ranges are inclusive unless you use parentheses** for exclusive bounds.
- **Prefix match is limited:** No arbitrary wildcards, only at the end (e.g., `jo*`)[1].
- **Wrap phrases in quotes** for exact match.
- **Negation can be combined** with field specifiers.
- **RediSearch is required for queries beyond basic key lookups**; pure Redis supports retrieval by key or pattern only.

---


## Usage via Python & Rust
Below are clear **Python** and **Rust** code examples for performing **CRUD and query operations** with each of the query languages we’ve discussed: **SQL, Cypher (Neo4j), GraphQL, Elasticsearch, Redis, and MongoDB**.

The examples focus on fundamental usage with each system's **official or leading community drivers**. Each snippet shows
+ connecting 
+ inserting 
+ querying 
+ updating
+ deleting

---

## 1. **SQL**

### Python (using `sqlite3` or `psycopg2`)
```python
import sqlite3

# Connect to SQLite database (create if not exists)
conn = sqlite3.connect('test.db')
cur = conn.cursor()

# Create table
cur.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)')
conn.commit()

# Insert
cur.execute('INSERT INTO users (name, age) VALUES (?, ?)', ('Alice', 30))
conn.commit()

# Query
cur.execute('SELECT * FROM users WHERE age > ?', (25,))
print(cur.fetchall())

# Update
cur.execute('UPDATE users SET age = ? WHERE name = ?', (31, 'Alice'))
conn.commit()

# Delete
cur.execute('DELETE FROM users WHERE name = ?', ('Alice',))
conn.commit()
conn.close()
```

### Rust (using `rusqlite`)
```rust
use rusqlite::{params, Connection, Result};

fn main() -> Result {
    let conn = Connection::open("test.db")?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)",
        [],
    )?;

    // Insert
    conn.execute("INSERT INTO users (name, age) VALUES (?1, ?2)",
                 params!["Alice", 30])?;

    // Query
    let mut stmt = conn.prepare("SELECT id, name, age FROM users WHERE age > ?1")?;
    let user_iter = stmt.query_map(, |row| {
        Ok((row.get::(0)?, row.get::(1)?, row.get::(2)?))
    })?;
    for user in user_iter {
        println!("{:?}", user?);
    }

    // Update
    conn.execute("UPDATE users SET age = ?1 WHERE name = ?2",
                 params![31, "Alice"])?;

    // Delete
    conn.execute("DELETE FROM users WHERE name = ?1", params!["Alice"])?;
    Ok(())
}
```

---

## 2. **Cypher (Neo4j)**

### Python (using `neo4j-driver`)
```python
from neo4j import GraphDatabase

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
with driver.session() as session:
    # Create
    session.run("CREATE (a:Person {name: $name, age: $age})", name="Alice", age=30)

    # Query
    result = session.run("MATCH (a:Person) WHERE a.age > $age RETURN a.name, a.age", age=25)
    for record in result:
        print(record)

    # Update
    session.run("MATCH (a:Person {name: $name}) SET a.age = $age", name="Alice", age=31)

    # Delete
    session.run("MATCH (a:Person {name: $name}) DETACH DELETE a", name="Alice")
driver.close()
```

### Rust (using `neo4rs`)
```rust
use neo4rs::{Graph, query};
use tokio; // Async runtime

#[tokio::main]
async fn main() -> neo4rs::Result {
    let graph = Graph::new("localhost:7687", "neo4j", "password").await?;

    // Create
    graph.execute(query("CREATE (a:Person {name: $name, age: $age})")
        .param("name", "Alice").param("age", 30)).await?;

    // Query
    let mut result = graph.execute(query("MATCH (a:Person) WHERE a.age > $age RETURN a.name, a.age")
        .param("age", 25)).await?;
    while let Ok(Some(row)) = result.next().await {
        println!("{:?}", row.get::("a.name"));
    }

    // Update
    graph.execute(query("MATCH (a:Person {name: $name}) SET a.age = $age")
        .param("name", "Alice").param("age", 31)).await?;

    // Delete
    graph.execute(query("MATCH (a:Person {name: $name}) DETACH DELETE a")
        .param("name", "Alice")).await?;
    Ok(())
}
```

---

## 3. **GraphQL**

### Python (using `requests` for remote GraphQL APIs)
```python
import requests

url = "http://localhost:4000/graphql"
query = '''
query GetUsers { users { id name } }
'''
r = requests.post(url, json={'query': query})
print(r.json())

# For a mutation:
mutation = '''
mutation AddUser($name: String!){ createUser(name: $name){ id name } }
'''
variables = {"name": "Alice"}
r = requests.post(url, json={'query': mutation, 'variables': variables})
print(r.json())
```

### Rust (using `reqwest` for generic HTTP GraphQL requests)
```rust
use reqwest::blocking::Client;
use serde_json::json;

fn main() -> Result> {
    let client = Client::new();
    let query = r#"
        query GetUsers { users { id name } }
    "#;
    let res = client.post("http://localhost:4000/graphql")
        .json(&json!({ "query": query }))
        .send()?
        .json::()?;
    println!("{:#?}", res);
    Ok(())
}
```

---

## 4. **Elasticsearch Query DSL**

### Python (using `elasticsearch`)
```python
from elasticsearch import Elasticsearch

es = Elasticsearch("http://localhost:9200")

# Insert document
es.index(index="test", id=1, body={"name": "Alice", "age": 30})

# Query documents
res = es.search(index="test", query={"range": {"age": {"gt": 25}}})
print(res["hits"]["hits"])

# Update document
es.update(index="test", id=1, body={"doc": {"age": 31}})

# Delete document
es.delete(index="test", id=1)
```

### Rust (using `elasticsearch` crate)

## 4. **Elasticsearch Query DSL (continued)**

### Rust (using [`elasticsearch`](https://crates.io/crates/elasticsearch) crate)
```rust
use elasticsearch::{Elasticsearch, http::transport::Transport, Error};
use serde_json::json;
use serde_json::Value;

#[tokio::main]
async fn main() -> Result {
    let transport = Transport::single_node("http://localhost:9200")?;
    let client = Elasticsearch::new(transport);

    // Insert a document
    client.index(elasticsearch::IndexParts::IndexId("test", "1"))
        .body(json!({ "name": "Alice", "age": 30 }))
        .send()
        .await?;

    // Query documents
    let response = client
        .search(elasticsearch::SearchParts::Index(&["test"]))
        .body(json!({
            "query": { "range": { "age": { "gt": 25 } } }
        }))
        .send()
        .await?;
    let body: Value = response.json().await?;
    println!("{:#?}", body);

    // Update a document
    client
        .update(elasticsearch::UpdateParts::IndexId("test", "1"))
        .body(json!({ "doc": { "age": 31 } }))
        .send()
        .await?;

    // Delete a document
    client
        .delete(elasticsearch::DeleteParts::IndexId("test", "1"))
        .send()
        .await?;

    Ok(())
}
```

---

## 5. **Redis (and RediSearch)**

### Python (using `redis` and `redisearch-py`)

#### Basic Redis
```python
import redis

r = redis.Redis(host='localhost', port=6379)

# Set and get a value
r.set('foo', 'bar')
print(r.get('foo'))

# HSET/HGET hash
r.hset('user:1', mapping={'name': 'Alice', 'age': 30})
print(r.hgetall('user:1'))

# Delete key
r.delete('foo')
```

#### RediSearch (requires the RediSearch module)
```python
from redis.commands.search.field import TextField, NumericField
from redis.commands.search.indexDefinition import IndexDefinition, IndexType
from redis.commands.search.query import Query
from redis.commands.search import Search

# Create the client and index
r = redis.Redis(host='localhost', port=6379)
# Assume RediSearch index is already created for 'users'

search = Search(r, 'users_idx')
# Insert document (underlying as Redis hash)
r.hset('user:1', mapping={'name': 'Alice', 'age': 31})

# Query by field
results = search.query('@name:Alice').load_all().execute()
for doc in results.docs:
    print(doc.__dict__)
```
(If creating an index or for more advanced RediSearch, see [docs](https://redis.io/docs/stack/search/))

---

### Rust (using `redis` crate)

#### Basic Redis
```rust
use redis::{Commands, RedisResult};

fn main() -> RedisResult {
    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut con = client.get_connection()?;

    // Set
    con.set("foo", "bar")?;
    let v: String = con.get("foo")?;
    println!("foo = {}", v);

    // Hash
    con.hset_multiple("user:1", &[("name", "Alice"), ("age", "30")])?;
    let user: redis::RedisResult = con.hgetall("user:1");
    println!("user:1 = {:?}", user);

    // Delete
    con.del("foo")?;
    Ok(())
}
```
*Note: As of 2024, native RediSearch commands aren't directly implemented in common Rust Redis clients. For RediSearch, you will need to use the low-level `cmd` API or construct commands as raw Redis strings.*

#### RediSearch (raw command — search for users named 'Alice')
```rust
use redis::{Commands, RedisResult};

fn main() -> RedisResult {
    let client = redis::Client::open("redis://127.0.0.1/")?;
    let mut con = client.get_connection()?;

    // RediSearch query (FT.SEARCH users_idx '@name:Alice')
    let search_results: redis::Value = redis::cmd("FT.SEARCH")
        .arg("users_idx")
        .arg("@name:Alice")
        .query(&mut con)?;
    println!("Search results: {:?}", search_results);

    Ok(())
}
```

---

## 6. **MongoDB**

### Python (using `pymongo`)
```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client.example

# Insert
db.users.insert_one({"name": "Alice", "age": 30})

# Query
docs = db.users.find({"age": {"$gt": 25}})
for doc in docs:
    print(doc)

# Update
db.users.update_one({"name": "Alice"}, {"$set": {"age": 31}})

# Delete
db.users.delete_one({"name": "Alice"})
```

### Rust (using `mongodb` crate)
```rust
use mongodb::{Client, options::ClientOptions, bson::doc};
use futures::stream::StreamExt;
use tokio;

#[tokio::main]
async fn main() -> mongodb::error::Result {
    let client_options = ClientOptions::parse("mongodb://localhost:27017").await?;
    let client = Client::with_options(client_options)?;
    let db = client.database("example");
    let users = db.collection("users");

    // Insert
    users.insert_one(doc! { "name": "Alice", "age": 30 }, None).await?;

    // Query
    let mut cursor = users.find(doc! { "age": { "$gt": 25 } }, None).await?;
    while let Some(doc) = cursor.next().await {
        println!("{:?}", doc?);
    }

    // Update
    users.update_one(doc! {"name": "Alice"}, doc!{"$set": {"age": 31}}, None).await?;

    // Delete
    users.delete_one(doc! {"name": "Alice"}, None).await?;
    Ok(())
}
```

---

# Summary Table

| System        | Python Library         | Rust Library         |
|---------------|-----------------------|----------------------|
| SQL           | sqlite3/psycopg2      | rusqlite/postgres   |
| Cypher/Neo4j  | neo4j-driver          | neo4rs              |
| GraphQL       | requests, gql         | reqwest, graphql-client |
| Elasticsearch | elasticsearch         | elastic



#### Jesus Saves @JCharisTech