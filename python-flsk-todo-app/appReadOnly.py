from GenericMainProgram import * 
from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import json

# Initialize the Flask application
app = Flask(__name__)


avengers =[]

@app.route('/')
def index():
	return render_template('index_readOnly.html')


@app.route('/_get_table')
def get_table():
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)

    df = pd.DataFrame(np.random.randint(0, 100, size=(a, b)))

    return jsonify(number_elements=a * b,
                   my_table=json.loads(df.to_json(orient="split"))["data"],
                   columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])


@app.route('/_get_mstable')
def getMstable():
    #a = request.args.get('a', type=int)
    #b = request.args.get('b', type=int)
    a=2
    b=3
    sql="""SELECT TOP (500) [id]
      ,[cust_id]
      ,[session_id]
      ,[ip]
      ,[input_type]
      ,[msg_type]
      ,[msg_id]
      ,[msg]
    
  FROM [SFDB].[afa].[flow_log]
        """
    conn =GenericMainProgram.getDBConnection('3-123', 'sfdb', 15)
    df =pd.read_sql(sql, conn)
    return jsonify(number_elements=a * b,
                   my_table=json.loads(df.to_json(orient="split"))["data"],
                   columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])
    conn.close()

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)