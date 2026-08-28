import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';
class ApiClient {
 Future<Map<String,String>> headers() async {final p=await SharedPreferences.getInstance();final t=p.getString('access_token');return {'Content-Type':'application/json','X-WarHex-Mobile':'1',if(t!=null&&t.isNotEmpty)'Authorization':'Bearer $t'};}
 Future<Map<String,dynamic>> post(String path,Map<String,dynamic> body) async {final r=await http.post(Uri.parse('${AppConfig.apiBaseUrl}$path'),headers:await headers(),body:jsonEncode(body)).timeout(const Duration(seconds:18));final d=jsonDecode(r.body.isEmpty?'{}':r.body);if(r.statusCode<200||r.statusCode>=300)throw Exception(d['error']??'تعذر الاتصال بالخادم');return Map<String,dynamic>.from(d as Map);}
}
