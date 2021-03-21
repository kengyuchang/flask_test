# -*- coding: utf-8 -*-
"""
Created on Wed Dec 25 15:17:09 2019

@author: F126191299
"""
import pymssql
import pandas as pd
import config
import getpass
import datetime
import smtplib, ssl
from email.mime.text import MIMEText
import logging
from logging.handlers import RotatingFileHandler


class GenericMainProgram:
    '''
    def __init__(self):
        user=getpass.getuser()
        self.logger=logging.getLogger(user)
        self.logger.setLevel(logging.DEBUG)
        format='%(asctime)s - %(levelname)s -%(name)s : %(message)s'
        formatter=logging.Formatter(format)
        streamhandler=logging.StreamHandler()
        streamhandler.setFormatter(formatter)
        self.logger.addHandler(streamhandler)
        #logfile='./' + user + '.log'
        logfile= datetime.datetime.now().strftime("./log/%Y-%m-%d.log")
        filehandler=logging.FileHandler(logfile)
        filehandler.setFormatter(formatter)
        self.logger.addHandler(filehandler)
    def debug(self, msg):
        self.logger.debug(msg)
    def info(self, msg):
        self.logger.info(msg)
    def warning(self, msg):
        self.logger.warning(msg)
    def error(self, msg):
        self.logger.error(msg)
    def critical(self, msg):
        self.logger.critical(msg)
    def log(self, level, msg):
        self.logger.log(level, msg)
    def setLevel(self, level):
        self.logger.setLevel(level)
    def disable(self):
        logging.disable(50)
    '''        
    def getConfigHash_JAVA(filename):
        config_dict= dict()
        fp=open(filename,"r")
        line =fp.readline()
        while len(line.strip())>1 :
            if"#"!=line[:1]:
                print (line)
                idx =line.index("=")
                config_dict[line[:idx].strip()] =line[idx+1:].strip()
                line =fp.readline()
        return  config_dict
    
    def getDBConnection_JAVA( resource ,dbType,dbName):
          server1=resource[dbType+"_DB_server"]
          user1=resource[dbType+"_DB_user"]
          password1=resource[dbType+"_DB_password"]
          conn  = pymssql.connect(
              server=server1,
              user=user1,
              password=password1,
              database=dbName,
              as_dict=True
            )
          return conn
      
    def getDBConnection(dbType,dbName,timOut):
          intimOut=15
          if timOut>intimOut:
              intimOut=timOut
          dictx=config.DB_conn
          conn  = pymssql.connect(
              server=dictx[dbType+'_server'],
              #user=dictx[dbType+'_user'],
              #password=dictx[dbType+'_password'],
              database=dbName,
              timeout=intimOut,
              as_dict=True
            )
          conn.autocommit(True)
          return conn
      
    def executeSQLWithConn(conn,sql):
        cursor = conn.cursor()
        cursor.execute(sql)
 
    def executeSQLWithConnInOut(conn,sql):
        results= dict()
        cursor = conn.cursor()
        cursor.execute(sql)
        results=cursor.fetchone()
        return results                    
      
    def executeSQL(sql,dbType,dbName,timOut):
        conn =GenericMainProgram.getDBConnection(dbType,dbName,timOut)
        try:
            cursor = conn.cursor()
            cursor.execute(sql)
        finally:
            conn.close()
    
    def executeSQLInOut(sql,dbType,dbName,timOut):
        results= dict()
        conn =GenericMainProgram.getDBConnection(dbType,dbName,timOut)
        try:
            cursor = conn.cursor()
            cursor.execute(sql)
            results=cursor.fetchone() 
        finally:
            conn.close()
        return results
    
    def Group_People_To_CC_BCC():
        To = []
        CC = []
        BCC = []
        To.append("cathaysec-gp205@cathaysec.com.tw")
        To.append("cathaysec-gp206@cathaysec.com.tw")
        #==
        CC.append("kengyu.c@cathaysec.com.tw")
       #CC.append("kengyu.c@cathaysec.com.tw")
        #==
        BCC.append("kengyu.c@cathaysec.com.tw")
        #BCC.append("vicguo@moldex3d.com")
        return To, CC, BCC
                
    def sendMail(title,msg):
        html="""
		<!doctype html>
		<html>
		<head>
		  <meta charset='utf-8'>
		  <title>'%s'</title>
		</head>
		<body>
		  <b>'%s'</b>
		</body>
		</html>
		"""%(title,msg)
        
        To, CC, BCC = GenericMainProgram.Group_People_To_CC_BCC()
        mime=MIMEText(html, "html", "utf-8")
        mime["Subject"]=title
        mime["From"]="m-datacenter@cathaysec.com.tw"
        mime["To"]=",".join(To)
        mime["Cc"]=",".join(CC)
        mime["Bcc"]=",".join(BCC)
        msg=mime.as_string()
        print(msg)

        smtp=smtplib.SMTP("cathaymail.linyuan.com.tw", 587)
        smtp.ehlo()
        smtp.starttls()
        smtp.login("m-datacenter@cathaysec.com.tw", "Cathay123")  
		#from_addr="m-datacenter@cathaysec.com.tw"
		#to_addr=["kengyu.c@cathaysec.com.tw"]
        status=smtp.sendmail(mime["From"], To + CC + BCC, msg)
        if status=={}:
            print("郵件傳送成功!")
        else:
            print("郵件傳送失敗!")
        smtp.quit()
		
    #def run():
        #config_dict1 =GenericMainProgram.getConfigHash_JAVA("D:\D\DataCenter\DBconfig.config")
        #conn1 = GenericMainProgram.getDBConnection_JAVA(config_dict1,'123','DB_MANAGE')
        #conn1 =GenericMainProgram.getDBConnection('125','DB_MANAGE',300)
        #sql ='select top 20 * from DB_MANAGE.dbo.執行序列 ' 
        #datas = pd.read_sql(sql, conn1)           
        #GenericMainProgram.sendMail('SECSVR3-125 Python RunProcess_error','cyndi')


#runPrgram
#GenericMainProgram.run()

#sql_ssis="""  EXEC DB_MANAGE.dbo.SP_RUNSSIS_CALL_BY_PYTHON \
#'%s', %s ,'%s' ,'%s', '%s', '%s' ,'%s' ,'%s' ,'%s' ,'%s', '%s', %s ,%s  \
#"""%('2019-12-27 12:00:00',2,'3','4','5','6','7','8','9','10','11',12)
#print(sql_ssis)
#cynid=GenericMainProgram.executeSQLInOut(sql_ssis,'125','DB_MANAGE',300)
#print(type(cynid))
#print(x2)
#for i in cynid:
    #print('begin')
   # print( i, cynid[i])
#GenericMainProgram.sendMail('SECSVR3-125-數據處理排程作業錯誤通知','用途說明: 1:儀表報表-國壽數位體驗問卷即時追蹤_15分鐘')