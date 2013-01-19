package org.view {
    /*
      Copyright (C) 2003-2006 Douglas Bagnall (douglas * paradise-net-nz)
    
      This program is free software; you can redistribute it and/or
      modify it under the terms of the GNU General Public License
      as published by the Free Software Foundation; either version 2
      of the License, or (at your option) any later version.
    
      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.
    
      You should have received a copy of the GNU General Public License
      along with this program; if not, write to the Free Software
      Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
    */
    
    import org.view.AvScrollBarItem;
	  import org.util.LoadTracker;
    import org.model.ModelAvatars;
    import org.util.ScrollButton;
    import org.thing.Avatar;
    import org.util.Construct;
    import org.Client;
    import flash.display.*;
    import flash.text.*;
	  import flash.events.*;
    
    /**
     * Author: BH, WW
     * Purpose: Avatar Image onscreen
     *
     * Move clip layout
     * Each row of scroll bar is three items
     * All placed and positioned on movie clip AvScrollBar at correct position
     * items[i] is an AvatarScrollBarItem with a frame for a button (with image)
     * and a text field
     * When the items[i] frame moves, so does the button and the textField
     *
     *  +--------------------------------------------------------------------+
     *  |                                                                    |
     *  | +-----------------------------+ +--------------------------------+ |
     *  | |items[i].btn (movie clip)    | | |items[i].nameField (text field) | 
     *  | |                                | |                                   | |
     *  | |onPress()                    | |Contains name of this avatar    | |
     *  | |Contains avatar image        | |Text content san not be selected| |
     *  | |Is pressable, use this.btn   | |or changed by the user          | |
     *  | +-----------------------------+ +--------------------------------+ |
     *  |                                                                    |
     *  |  items[i] movie clip named 'icon_ID' where ID is a number          |
     *  |  Frame for icon & name, use this.frm                               |
     *  +--------------------------------------------------------------------+
     *
     *
     *  A full size image is also loaded for the mirror and parented to AvScrollBar
     *  This is set visible when the avatar is selected.
     *  The position is never changed
     *  
     * @modified Shaun Narayan (Feb 2010) - Converted to AS3. usual changes (Package declaration,
     * 								removal of _ prefix fields, new moviclip registration method, 
     * 								new event handling etc...)
     * 			 Shaun Narayan (Apr 2010) - added initialization of some null fields, removed sorting for
     * 			 							now, got avName to actually display the name, and added exception
     * 			 							checks for a commonly null icon??
     */
    
    public class AvScrollBar extends MovieClip 
    {
        public var ti            :ModelAvatars;
        public var nameLayer     :Number;      // mirror text
        public var layer         :Number;      // for scroll bar items
        public var icon          :AvScrollBarItem;
    
        public var startPos      :Number;      // first av currently visible
        public var items         :Array;       // array of AvatarScrollBarItems
        public var loadCount     :Number;      // So know when to setReady()
        public var avName        :TextField;   // Under mirror
    
        public var layerUp          :ScrollButton;
        public var layerDown     :ScrollButton;
    
        public var up            :ScrollButton;   // Buttons on scrollbar
        public var down          :ScrollButton;   // Buttons on scrollbar
   
            
    
        /**
         * @brief factory
         */
        static public function create(stage :MovieClip, name :String,
                                      layer :Number, x :Number, y:Number,
                                      ti :ModelAvatars, col:Number) :AvScrollBar
        {
            var out :AvScrollBar;
            out = new AvScrollBar();
            out.ti = ti;
            out.nameLayer = layer + 1;
            out.x = x;
            out.y = y;       
            out.drawUI(col);
            // Which items are currently visible in the scrollbar (up / down changes)
            out.startPos  = 0;  // First item to view
            out.loadCount = 0;  // Number of avatars that have finished loading
            out.items    = new Array; // Array of AvScrollBarItems
            // Setup base movie position & visibility
            out.enabled = true;
            //Construct.deepTrace(out);
            stage.addChild(out);
            return out;
        };
    
    
        /**
         * @brief draw the various boxes.
         */
        private function drawUI(col:Number)
        {
    
            // Draw scrollbar
            Construct.uiRectangle(this, Client.AV_SCROLL_X, Client.AV_SCROLL_Y,
                                  Client.AV_SCROLL_WIDTH, Client.AV_SCROLL_HEIGHT, col);
    
            // Draw mirror
            Construct.uiRectangle(this, Client.AV_MIRROR_X, Client.AV_MIRROR_Y,
                                  Client.AV_MIRROR_WIDTH, Client.AV_MIRROR_HEIGHT, col);
            
            this.layerUp = ScrollButton.factory(this, 'up', 1, Client.AV_LAYER_BTN_X, Client.AV_LAYER_UP_Y);
            this.layerDown = ScrollButton.factory(this, 'down', 1, Client.AV_LAYER_BTN_X, Client.AV_LAYER_DOWN_Y);
    
            var txtFieldAttrs :Object = {};//Construct.getFixedTextAttrs();
            txtFieldAttrs.border = true;
            txtFieldAttrs.background = true;
            txtFieldAttrs.borderColor = Client.BORDER_COLOUR;            
            txtFieldAttrs.backgroundColor = col;
    
            this.avName = Construct.formattedTextField(this, 'avName', this.nameLayer, 
                                         Client.AV_NAME_X, Client.AV_NAME_Y, 
                                         Client.AV_NAME_WIDTH, Client.AV_NAME_HEIGHT,
                                         1.3, true, txtFieldAttrs, Construct.getFixedTextAttrs()
                                         );
    
    
            // Set up scroll buttons 
            var avsb: AvScrollBar = this;
    
            this.up = ScrollButton.factory(this, 'up', 1, Client.AV_SCROLL_BTN_X, Client.AV_SCROLL_UP_Y);
            this.down = ScrollButton.factory(this,'down', 1, Client.AV_SCROLL_BTN_X, Client.AV_SCROLL_DN_Y);

            this.up.addEventListener(MouseEvent.CLICK, function(){
                avsb.moveUp();
            });
    
            this.down.addEventListener(MouseEvent.CLICK, function(){
                avsb.moveDown();
            });
    
            this.layerUp.addEventListener(MouseEvent.CLICK, function() {
                avsb.ti.MOVE_LAYER_UP();
            });
            
            this.layerDown.addEventListener(MouseEvent.CLICK, function() {
                avsb.ti.MOVE_LAYER_DOWN();
            });
        }
    
    
        /**
         * @brief Called after all movies have loaded
         */
        public function setReady() :void

        {
            trace('AvatarScrollBar.setReady() called');
            //Construct.deepTrace(this);
            /* Sort items list.  You can't use Array.sortOn() directly
             * on MovieClips (which always sort by reference),  
             * so a sort public function or Schwartzian transform is necessary
             */
            /**this.items.sort(function(A: AvScrollBarItem, B: AvScrollBarItem):Number
                            {
                                return A.nameof.toLowerCase() <= B.nameof.toLowerCase() ? -1 : 1;            
                            }
                            );
    		*/
            this.reposition();
        };
    
    
        /**
         * @brief Add an avatar to the scrollbar, called by Avatar
         */
        public function addAvatar(av: Avatar)
        {
            //trace("addAvatar begins");
            this.items.push(av.myIcon);
        };
    
    
        /**
         * @brief Set the position / visibility of scrollbar items
         * based on current start  positions
         */
        public function reposition(): void
        {
            var i: Number;
            var skipped: Number = 0;
            var possibles: Array = [];
            //loop throught the items, putting appropriate ones in the
            //possibles array.  If the user's selected avatar would be
            //shown, don't show it, and keep note that on item was
            //skipped.  This helps in the greying of buttons.
            for (i = 0; i < this.items.length; i++)
            {
                var item :AvScrollBarItem = this.items[i];
                if (i >= this.startPos && possibles.length < Client.DISPLAY_AV )                            
                {
                    if (item != this.icon)
                    {
                        possibles.push(item);
                    }
                    else
                    {
                        //note that we've skipped it
                        skipped = 1;
                        if(item != null)
                        	item.hide();
                    }
                }
                else
                {
                    item.hide();
                }
            }
            //it could be that insufficient were found, if last item was
            //selected.  go back and look for selected ones.
            while(possibles.length < Client.DISPLAY_AV && this.startPos > 0)
                {
                    this.startPos--;
                    var item :AvScrollBarItem = this.items[this.startPos];
                    if (item != this.icon)
                        {
                            possibles.unshift(item);
                        }
                }
            
            //actually show the icons.
            for (i = 0; i < possibles.length; i++)
                {
                    var item :AvScrollBarItem = possibles[i];
                    // Position, show & enable
                    item.x = Client.AV_SCROLL_X + 1;
                    item.y = i * (Client.ICON_SIZE + 1);
                    item.show();
                }
    
            //if first icon is selected, and startPos is at 1,
            // you can't scroll up, but startPos doesn't know
            //
            // likewise, if last icon is selected, and startPos is such
            // that the display ends justbefore it, you can't scroll down.
            // skipped can be set to trigger greying.
    
            if (this.icon == this.items[this.startPos+ possibles.length])
                skipped = 1;
            
            // grey out scroll buttons if at top or bottom.
    
            if (this.startPos == 0 || 
                (this.startPos == 1 && this.icon == this.items[0])){
                this.up.grey();
            }
            else {
                this.up.ungrey();
            }
    
            if (this.startPos + possibles.length + skipped >= this.items.length){
                this.down.grey();
            }
            else {
                this.down.ungrey();
            }
        };
    
    
        /**
         * @brief Move the item at the given index to mirror & hide text field
         */
        public function select(item :AvScrollBarItem): void
        {
            if (this.icon){
                this.icon.unselect();
            }
            this.icon = item;
            item.selectItem();
            // Show avatar name from mirror
            this.avName.text = item.nameof;
            reposition();
        };
    
    
        /**
         * @brief Biff the icon off the mirror,
         */
        public function dropAvatar():void

        {
        	if(this.icon)
            {
            	this.icon.unselect();
            	this.icon = null;
            }
            this.avName.text = '';
            reposition();
        };
    
    
        /**
         *  @brief Select the avatar at the given ID
         */
        public function choose(icon: AvScrollBarItem): void
        {
            // If the avatar is available, select it
            if (icon.available)
                {
                    // Tell the server that we have selected the avatar
                    this.ti.SET_AV(icon.ID);
                }
        };
    
    
    
        /**
         *  @brief Scroll up one avatar
         */
        public function moveUp(): void
        {
            if (this.startPos > 0)
                {
                    //need to jump up 2 if first one will be hidden, or it apears not to move.
                    if (this.items[this.startPos - 1] == this.icon)
                        this.startPos -= 2;
                    else
                        startPos--;
                    reposition();
                }
            else{
                trace("can't go up!!");
                this.up.grey();
            }
    
        };
    
    
        /**
         *  @brief Scroll down one avatar
         */
        public function moveDown() : void
        {
            if (this.startPos + Client.DISPLAY_AV < this.items.length)
                {
                    //need to jump down 2 if first one is hidden, or it apears not to move.
                    if (this.items[this.startPos] == this.icon)
                        this.startPos += 2;
                    else
                        startPos++;
                    reposition();
                }
            else{
                trace("can't go down!!");
                this.down.grey();
            }
        };
    
    
        /**
         *  @brief Rename an avatar for the duration of the performance
         */
        public function rename(item: AvScrollBarItem, name: String): void
        {
            item.nameof = name;
            item.nameField.text = name;
            
            // Update mirror text if this is the selected item
            if (item = this.icon)
                {
                    this.avName.text = name;
                }
        };
    
    
        /**
         *  @brief Called automatically by AvScrollBarItem when mirror has loaded
         */
        public function loaded() : void
        {
            this.loadCount++;
            // Check if all load requests are done
            // Possible race condition with incoming LOAD_AV messages & the speed
            // at which avatars load
            // TODO listen to CONFIRM_READY will stop race condition
    
            // XXX better for server to (early on) send the number of
            // things waiting for load, to the SplashScreen model.  then
            // it can be perfect.
            if (this.loadCount == this.items.length)
                {
                    this.setReady();
                }
        };
    
    
    
        /**
         * @brief turn on/off animator
         */
        public function showFrame(): void
        { //XXX eh?
        }
    
    
        public function AvScrollBar(){}
    
    };
}
