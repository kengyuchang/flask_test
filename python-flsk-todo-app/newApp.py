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
	return render_template('newIndex.html')

@app.route('/getfuncb')
def getFuncB():
    #results = [{"b":"20","sfsname":"2"},{}]
    sql="""    
        	   SELECT TOP (1000) 
              [專案代號]
        	  ,專案說明
              ,通知方式
        	  ,專案開始日
        	  ,專案結束日
        	  ,專案負責人
        	  ,停用
          FROM [NEW_OUTBOUND].[dbo].[訊息主檔] where
    """
    conn =GenericMainProgram.getDBConnection('3-125', 'NEW_OUTBOUND', 15)
    df =pd.read_sql(sql, conn)

    #dic=GenericMainProgram.executeSQLInOut(sql,'3-123', 'OUTBOUND', 15)
    #df= pd.DataFrame(dic)
    rename_dic={"專案代號":"if01ColG1ProjectNo"
                ,"專案說明":"if01ColG1ProjectDesc"
                ,"通知方式":"if01ColG1Notice"
                ,"專案說明":"if01ColG1ProjectDesc"
                ,"專案說明":"if01ColG1ProjectDesc"
                ,"專案說明":"if01ColG1ProjectDesc"
                ,"專案說明":"if01ColG1ProjectDesc"
                }
    res2 =df.rename(rename_dic, axis=1).to_dict()
    res2["if01ColG1ProjectNo"]    =df['專案代號'].values.tolist()
    res2["if01ColG1ProjectDesc"]  =df['專案說明'].values.tolist()
    res2["if01ColG1Notice"]  =df['通知方式'].values.tolist()
    res2["if01ColG1ProjectBeginDay"]  =df['專案開始日'].values.tolist()
    res2["if01ProjectEndDay"]  =df['專案結束日'].values.tolist()
    res2["if01ColG1ProjectDesc"]  =df['專案負責人'].values.tolist()
    res2["if01ProjectStop"]  =df['停用'].values.tolist()
    res2["if01Begin"]="0"
    res2["if01Count"]=str(df.size)
    res2["if01Total"]=str(df.size)
    res2["if01View"]=""
    res2["if01Type"]=""
    res2["sfsname"]=3
    res2["b"]=30
    res2["a"]=100



    return jsonify(res2)

@app.route('/getfunca')
def getFuncA():
    results={
             "b":"20"
             ,"a":"20"
             ,"sfsname":"2"
             ,"if01Begin":"0"
             ,"if01Total":"1"
             ,"if01Count":"1"
             ,"if01View":""
             ,"if01Type":""
             ,"if01ColProjectNo":["2xxx"]
             }



    return jsonify(results)


if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)