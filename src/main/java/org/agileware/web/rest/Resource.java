package org.agileware.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping(value = "/rest/resource", produces = "application/json")
@PreAuthorize("hasRole('ROLE_OAUTH')")
public class Resource {
	
	private long count;
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody List<String> list() {
		count++;
		List<String> result = new ArrayList<String>();
		for (int i = 0; i < 20; i++) {
			result.add("item " + count + ":" + i);
		}
		return result;
	}

}
