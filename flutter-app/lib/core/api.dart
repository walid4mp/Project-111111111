import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'config.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  ApiException(this.message, {this.statusCode});
  @override
  String toString() => message;
}

class ApiClient {
  Future<Map<String, String>> headers() async {
    final p = await SharedPreferences.getInstance();
    final t = p.getString('access_token');
    return {
      'Content-Type': 'application/json',
      'X-WarHex-Mobile': '1',
      if (t != null && t.isNotEmpty) 'Authorization': 'Bearer $t',
    };
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}$path');
    late http.Response r;
    try {
      r = await http
          .post(url, headers: await headers(), body: jsonEncode(body))
          .timeout(const Duration(seconds: 18));
    } on SocketException {
      throw ApiException('تعذّر الاتصال بالخادم. تحقق من الإنترنت أو حاول لاحقًا.');
    } on TimeoutException {
      throw ApiException('انتهت مهلة الاتصال بالخادم. حاول مرة أخرى.');
    } on http.ClientException {
      throw ApiException(
          'تعذّر الوصول إلى الخادم (${AppConfig.apiBaseUrl}). قد يكون الرابط غير متاح مؤقتًا.');
    } catch (_) {
      throw ApiException('حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    }
    final raw = r.body.isEmpty ? '{}' : r.body;
    Map<String, dynamic> d;
    try {
      d = Map<String, dynamic>.from(jsonDecode(raw) as Map);
    } catch (_) {
      d = <String, dynamic>{};
    }
    if (r.statusCode < 200 || r.statusCode >= 300) {
      final rawError = d['error']?.toString();
      final friendly = _friendlyError(rawError, r.statusCode);
      throw ApiException(friendly, statusCode: r.statusCode);
    }
    return d;
  }

  Future<Map<String, dynamic>> get(String path) async {
    final url = Uri.parse('${AppConfig.apiBaseUrl}$path');
    late http.Response r;
    try {
      r = await http
          .get(url, headers: await headers())
          .timeout(const Duration(seconds: 18));
    } on SocketException {
      throw ApiException('تعذّر الاتصال بالخادم. تحقق من الإنترنت أو حاول لاحقًا.');
    } on TimeoutException {
      throw ApiException('انتهت مهلة الاتصال بالخادم. حاول مرة أخرى.');
    } on http.ClientException {
      throw ApiException(
          'تعذّر الوصول إلى الخادم (${AppConfig.apiBaseUrl}). قد يكون الرابط غير متاح مؤقتًا.');
    } catch (_) {
      throw ApiException('حدث خطأ غير متوقع أثناء الاتصال بالخادم.');
    }
    final raw = r.body.isEmpty ? '{}' : r.body;
    final d = Map<String, dynamic>.from(jsonDecode(raw) as Map);
    if (r.statusCode < 200 || r.statusCode >= 300) {
      throw ApiException(d['error']?.toString() ?? 'تعذّر الاتصال بالخادم',
          statusCode: r.statusCode);
    }
    return d;
  }

  String _friendlyError(String? raw, int? status) {
    if (raw == null || raw.isEmpty) {
      return 'تعذّر إنشاء الحساب. رمز الحالة: $status';
    }
    final lower = raw.toLowerCase();
    if (lower.contains('already') && lower.contains('registered')) {
      return 'هذا البريد مسجل مسبقًا.';
    }
    if (lower.contains('username') && lower.contains('taken')) {
      return 'اسم المستخدم محجوز، اختر اسمًا آخر.';
    }
    if (lower.contains('email') && (lower.contains('invalid') || lower.contains('valid'))) {
      return 'البريد الإلكتروني غير صالح.';
    }
    if (lower.contains('password') && lower.contains('short')) {
      return 'كلمة المرور قصيرة جدًا.';
    }
    if (raw.length > 240) return raw.substring(0, 240);
    return raw;
  }
}
