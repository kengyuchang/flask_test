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
	return render_template('index.html')

@app.route('/test')
def test():
	return render_template('test.html')

@app.route('/test01')
def test01():
	return render_template('test01.html')


@app.route('/_get_table')
def get_table():
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)

    df = pd.DataFrame(np.random.randint(0, 100, size=(a, b)))

    return jsonify(number_elements=a * b,
                   my_table=json.loads(df.to_json(orient="split"))["data"],
                   columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])

@app.route('/getfuncd')
def getFuncD():
    results={}
    results={
      "data": [
        [
          "Tiger Nixon",
          "System Architect",
          "Edinburgh",
          "5421",
          "2011/04/25",
          "$320,800"
        ],
        [
          "Garrett Winters",
          "Accountant",
          "Tokyo",
          "8422",
          "2011/07/25",
          "$170,750"
        ]]
    }
    return jsonify(results)

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
    cc=df['if05ColProjectNo'].values.tolist()
    #dic=GenericMainProgram.executeSQLInOut(sql,'3-123', 'OUTBOUND', 15)
    #df= pd.DataFrame(dic)
    rename_dic={"專案代號":"if05ColProjectNo"}
    res2 =df.rename(rename_dic, axis=1).to_dict()
    res2["if05ColProjectNo"]=cc
    res2["if05Begin"]="0"
    res2["if05Count"]=str(df.size)
    res2["if05Total"]=str(df.size)
    res2["if05View"]=""
    res2["if05Type"]=""
    res2["sfsname"]=3
    res2["b"]=30
    res2["a"]=100



    return jsonify(res2)

@app.route('/_get_funca')
def getFuncA():
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)

    df = pd.DataFrame(np.random.randint(0, 100, size=(a, b)))

    return jsonify(number_elements=a * b,
                   my_table=json.loads(df.to_json(orient="split"))["data"],
                   columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])

@app.route('/_get_mstable')
def getMstable():
    a = request.args.get('a', type=int)
    b = request.args.get('b', type=int)

    sql="""    
			select npr.專案代號 ,npr.通知方式,npr.專案說明,npr.專案負責人,npr.專案開始日,npr.專案結束日,npr.停用,\
			CASE \
			    WHEN npr.通知方式='EMAIL' THEN 'EMAIL'\
				WHEN npr.通知方式='SMS' THEN sms.簡訊內容\
				WHEN npr.通知方式='Push' THEN aph.推播內容 END as  內容\
			from  OUTBOUND.[dbo].[Notice_Project_Registry] npr\
			left join  OUTBOUND.[dbo].[Notice_SMS] sms on npr.專案代號 = sms.專案代號\
			left join  OUTBOUND.[dbo].Notice_App_Push aph on npr.專案代號 = aph.專案代號\
            where npr.停用 ='N'\
            order by 專案負責人\
        """
    conn =GenericMainProgram.getDBConnection('3-123', 'OUTBOUND', 15)
    df =pd.read_sql(sql, conn)
    return jsonify(number_elements=a * b,
                   my_table=json.loads(df.to_json(orient="split"))["data"],
                   columns=[{"title": str(col)} for col in json.loads(df.to_json(orient="split"))["columns"]])


@app.route('/avengers', methods=['GET'])
def avengers_properties():
    results = []
    nationality = ""
    if 'nationality' in request.args:
        nationality = request.args['nationality']
    else:
        print("no hero")    

    for avenger in avengers:
        if avenger['nationality'] == nationality:
            results.append(avenger)


    return jsonify(results)

if __name__ == '__main__':
    app.debug = True
    app.run(host='localhost', port=5000)