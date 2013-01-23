const Lang = imports.lang;
const St = imports.gi.St;
const Cinnamon = imports.gi.Cinnamon;
const Applet = imports.ui.applet;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const GLib = imports.gi.GLib;

function MyApplet(metadata,orientation, panel_height) {
    this._init(metadata,orientation, panel_height);
}

MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(metadata,orientation, panel_height) {       
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height);

        try {
            this.set_applet_icon_symbolic_name("document-save");
            this.set_applet_tooltip(_("download wallpaper for web"));
            this.metadata=metadata
	    //读取配置文件
	    this.conf=new GLib.KeyFile()
	    this.conf.load_from_file(metadata.path+"/wallpaper.conf", GLib.KeyFileFlags.NONE)
	    this.wallpaperlist=this.conf.get_groups()[0]
            
	    this.menuManager = new PopupMenu.PopupMenuManager(this);
            this.menu = new Applet.AppletPopupMenu(this, orientation);
            this.menuManager.addMenu(this.menu);
	    //创建菜单
	    for(let i in this.wallpaperlist){
		Name=this.wallpaperlist[i]
		this.menu.addAction(_(Name),Lang.bind(this,this._item_clicked));
	    }
            
        }
        catch (e) {
	    GLib.spawn_command_line_async('notify-send "'+e+'"')
            global.logError(e);
        }
    },
    _item_clicked: function(event){
	//获取菜单文本
	
	Id=event.get_source().get_children()[0].get_text()
	//GLib.spawn_command_line_async("notify-send '"+Id+"'")

	cmd="python "+this.metadata.path+"/wallpaper.py";
	//GLib.spawn_command_line_async("notify-send '"+cmd+"'")
	
	cmd+=" "+GLib.base64_encode(this.metadata.save_path)
	//GLib.spawn_command_line_async("notify-send '"+cmd+"'")

	cmd+=" "+GLib.base64_encode(Id)
	//GLib.spawn_command_line_async("notify-send '"+cmd+"'")

	cmd+=" "+GLib.base64_encode(this.conf.get_value(Id,'url'))
	//GLib.spawn_command_line_async("notify-send '"+cmd+"'")

	cmd+=" "+GLib.base64_encode(this.conf.get_value(Id,'checker'))
        global.logError(cmd);
	GLib.spawn_command_line_async(cmd)
        
    },
    on_applet_clicked: function(event) {
        this.menu.toggle();        
    },
        
};

function main(metadata, orientation, panel_height) {  
    let myApplet = new MyApplet(metadata,orientation, panel_height);
    return myApplet;      
}
