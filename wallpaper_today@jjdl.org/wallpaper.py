#coding=utf8
#python 2.7

#脚本参数 使用base64编码
#save_path[1] name[2] url[3] regx_path[4]
#壁纸保存目录[1] 网站名称[2] 壁纸地址[3] 壁纸匹配正则表达式[4]
#设置壁纸保存目录,/ 结尾

#操作网络需要
import urllib
#正则表达式需要
import re
#调用系统命令需要
import os
#获取脚本参数
import sys
#解码参数
import base64

#os.system('notify-send 1:'+sys.argv[1])
#os.system('notify-send 2:'+sys.argv[2])
#os.system('notify-send 3:'+sys.argv[3])
#os.system('notify-send 4:'+sys.argv[4])

try:
    save_path=base64.decodestring(sys.argv[1])
    name=base64.decodestring(sys.argv[2])
    url=base64.decodestring(sys.argv[3])
    regx_checker=base64.decodestring(sys.argv[4])
except:
    exit()

#os.system('notify-send "'+save_path+'"')
#os.system('notify-send "'+name+'"')
#os.system('notify-send "'+url+'"')
#os.system('notify-send "'+regx_checker+'"')

#打开链接
try:
    html=urllib.urlopen(url).read()
except:
    os.system('notify-send "无法连接到'+name+'网站"')
    exit()

#使用正则表达式寻找壁纸地址,将壁纸地址命名为 link, 壁纸名称为 pic
#Bing必应
try:
    checker=re.compile(regx_checker)
    info=checker.search(html).groupdict()
except:
    os.system('notify-send "'+name+'无今日壁纸."')

#os.system('notify-send "'+info['link']+'"')


#检测壁纸是否存已经存在,若存在则退出，否则下载
fname=save_path+info['pic']
if os.path.exists(fname):
    os.system('notify-send "'+name+'今日壁纸已存在."')
    exit()

#下载壁纸
        
try:
    link=info['link']
    picdata=urllib.urlopen(link).read()
except:
    try:
        link=url+'/'+info['link']
        picdata=urllib.urlopen(link).read()
    except:
        os.system('notify-send url错误!')
        exit()

#保存壁纸到save_path,save_path咱们在前面定义了
f=file(fname,'w')
f.write(picdata)
f.close()

#设置壁纸
# 适用于gnome 3,也许适用于gnome 2
os.system('gsettings set org.gnome.desktop.background picture-uri "file://'+fname+'"')
#设置壁纸样式
## Possible values: centered, none, scaled, spanned, stretched, wallpaper, zoom
os.system('gsettings set org.gnome.desktop.background picture-options wallpaper')
os.system('notify-send "'+name+'今日壁纸下载完成."')
