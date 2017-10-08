/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint;

import edu.eci.arsw.collabpaint.model.Point;
import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author KevinMendieta
 */
@Controller
public class STOMPMessagesHandler {
    
    @Autowired
    SimpMessagingTemplate msgt;
    ConcurrentHashMap<String, ArrayList<Point>> polygons = new ConcurrentHashMap<>();
    
    @MessageMapping("/newpoint.{numdibujo}")    
    public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {
        if (polygons.containsKey(numdibujo)){
           polygons.get(numdibujo).add(pt);
           if (polygons.get(numdibujo).size() > 2) msgt.convertAndSend("/topic/newpolygon."+numdibujo, polygons.get(numdibujo));
        }else {
            ArrayList newList = new ArrayList<>();
            newList.add(pt);
            polygons.put(numdibujo, newList);
        }
        //msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
    }
    
}
