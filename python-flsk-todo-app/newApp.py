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
			select npr.專案代號 \
			from  OUTBOUND.[dbo].[Notice_Project_Registry] npr\
			left join  OUTBOUND.[dbo].[Notice_SMS] sms on npr.專案代號 = sms.專案代號\
			left join  OUTBOUND.[dbo].Notice_App_Push aph on npr.專案代號 = aph.專案代號\
        where npr.停用 ='N'\
        order by 專案負責人\
    """
    conn =GenericMainProgram.getDBConnection('3-123', 'OUTBOUND', 15)
    df =pd.read_sql(sql, conn)

    #dic=GenericMainProgram.executeSQLInOut(sql,'3-123', 'OUTBOUND', 15)
    #df= pd.DataFrame(dic)
    rename_dic={"專案代號":"if01ColProjectNo"}
    cc=df['專案代號'].values.tolist()
    res2 =df.rename(rename_dic, axis=1).to_dict()
    res2["if01ColProjectNo"]=cc
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