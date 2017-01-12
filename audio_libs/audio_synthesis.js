var osc_synthesis = function(a, f, t){
    if (a == 0){
        return 0;
    }
    return a * Math.sin(2 * Math.PI * f * t + Math.PI/4)
};

var sinus_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return osc_synthesis(args.a, args.f, args.t);
}

var additive_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return osc_synthesis(args.a1, args.f1, args.t) + osc_synthesis(args.a2, args.f2, args.t);  
};

var am_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return args.a * osc_synthesis((args.c + osc_synthesis(args.a, args.fm, args.t))/(args.c + args.a), args.fc, args.t);
};

var fm_synthesis = function (args){
    if (args.a == 0){
        return 0;
    }
    return args.a * Math.sin((2 * Math.PI * args.fc * args.t) + osc_synthesis(args.I, args.fm, args.t));
}

var calc_a = function (f, f0){
	return ((2 * f0) - f)/f0;
}

var shepard_synthesis = function (args){
	var ret = 0;
    args2 = {}
    
	for (i = 1; i< 6; i++) {
        args2.a1 = calc_a(args.f, 440);
        args2.f1 = args.f * Math.pow(2, i) / 2;
        args2.a2 =  1 - calc_a(args.f, 440);
        args2.f2 = args.f / Math.pow(2, i);
        args2.t = args.t
		ret += additive_synthesis(args2);
	}
	ret /= 6;

	return ret;
}