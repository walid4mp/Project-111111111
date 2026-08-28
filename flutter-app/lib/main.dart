import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'core/api.dart';
import 'core/config.dart';

void main() {
  runApp(const WarHexApp());
}

class WarHexApp extends StatelessWidget {
  const WarHexApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: AppConfig.appName,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xff070914),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xff7c3aed),
          brightness: Brightness.dark,
        ),
      ),
      home: const StartupScreen(),
    );
  }
}

class StartupScreen extends StatefulWidget {
  const StartupScreen({super.key});

  @override
  State<StartupScreen> createState() => _StartupScreenState();
}

class _StartupScreenState extends State<StartupScreen>
    with SingleTickerProviderStateMixin {
  double progress = 0;
  String status = 'تهيئة الواجهة…';
  late final AnimationController pulse;

  @override
  void initState() {
    super.initState();
    pulse = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1100),
    )..repeat(reverse: true);
    boot();
  }

  Future<void> boot() async {
    const steps = <({String text, double value})>[
      (text: 'تهيئة الواجهة…', value: .18),
      (text: 'فحص الاتصال…', value: .38),
      (text: 'تحميل الحساب…', value: .58),
      (text: 'تجهيز الألعاب…', value: .82),
      (text: 'اكتمل التشغيل', value: 1.0),
    ];

    for (final step in steps) {
      if (!mounted) return;
      setState(() {
        status = step.text;
        progress = step.value;
      });
      await Future.delayed(const Duration(milliseconds: 420));
    }

    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const LoginScreen()),
      );
    }
  }

  @override
  void dispose() {
    pulse.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xff183675), Color(0xff311050), Color(0xff070914)],
          ),
        ),
        child: Center(
          child: Container(
            width: 350,
            padding: const EdgeInsets.all(26),
            margin: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: const Color(0xee10162a),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: Colors.white12),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ScaleTransition(
                  scale: Tween<double>(begin: .95, end: 1.05).animate(pulse),
                  child: Container(
                    width: 100,
                    height: 100,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      gradient: const LinearGradient(
                        colors: [Color(0xff2563eb), Color(0xff9333ea)],
                      ),
                      boxShadow: const [
                        BoxShadow(color: Color(0xff7c3aed), blurRadius: 30),
                      ],
                    ),
                    child: const Center(
                      child: Text(
                        'WH',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                const Text(
                  'WarHex',
                  style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900),
                ),
                const SizedBox(height: 5),
                const Text(
                  'ألعاب • أصدقاء • منافسة',
                  style: TextStyle(color: Color(0xff9aa5bd)),
                ),
                const SizedBox(height: 38),
                Text(
                  status,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 15),
                ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: LinearProgressIndicator(value: progress, minHeight: 8),
                ),
                const SizedBox(height: 10),
                Text(
                  '${(progress * 100).round()}%  •  ${progress < 1 ? 'جاري التحميل' : 'جاهز'}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xff9aa5bd),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  bool loading = false;
  bool obscure = true;
  String error = '';

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  Future<void> login() async {
    setState(() {
      loading = true;
      error = '';
    });

    try {
      final data = await ApiClient().post('/api/auth/login', {
        'email': email.text.trim(),
        'password': password.text,
      });

      final prefs = await SharedPreferences.getInstance();
      final accessToken = data['access_token'];
      final refreshToken = data['refresh_token'];

      if (accessToken is! String || accessToken.isEmpty) {
        throw Exception('لم يُرجع الخادم رمز تسجيل الدخول.');
      }

      await prefs.setString('access_token', accessToken);
      if (refreshToken is String && refreshToken.isNotEmpty) {
        await prefs.setString('refresh_token', refreshToken);
      }

      if (!mounted) return;
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } catch (e) {
      if (mounted) {
        setState(() => error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthScaffold(
      child: Column(
        children: [
          const BrandMark(),
          const SizedBox(height: 18),
          const Text(
            'تسجيل الدخول',
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 7),
          const Text(
            'ادخل إلى مجتمع ألعاب WarHex',
            style: TextStyle(color: Color(0xff9aa5bd)),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: email,
            keyboardType: TextInputType.emailAddress,
            decoration: authField('البريد الإلكتروني', Icons.email_outlined),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: password,
            obscureText: obscure,
            decoration: authField('كلمة المرور', Icons.lock_outline).copyWith(
              suffixIcon: IconButton(
                onPressed: () => setState(() => obscure = !obscure),
                icon: Icon(
                  obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                ),
              ),
            ),
          ),
          if (error.isNotEmpty) ...[
            const SizedBox(height: 14),
            Text(
              error,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xffff9b9b)),
            ),
          ],
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: FilledButton(
              onPressed: loading ? null : login,
              child: loading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text(
                      'دخول',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                    ),
            ),
          ),
          const SizedBox(height: 10),
          TextButton(
            onPressed: loading
                ? null
                : () => Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const SignUpScreen()),
                    ),
            child: const Text('إنشاء حساب جديد'),
          ),
        ],
      ),
    );
  }
}

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  final username = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  final confirm = TextEditingController();
  bool loading = false;
  bool obscure = true;
  String error = '';

  @override
  void dispose() {
    username.dispose();
    email.dispose();
    password.dispose();
    confirm.dispose();
    super.dispose();
  }

  Future<void> signup() async {
    final user = username.text.trim();
    final mail = email.text.trim().toLowerCase();
    final pass = password.text;
    final confirmation = confirm.text;

    if (user.length < 3 || user.length > 24 ||
        !RegExp(r'^[A-Za-z0-9_]+$').hasMatch(user)) {
      setState(() => error = 'اسم المستخدم يجب أن يكون 3 إلى 24 حرفًا، أرقامًا أو _.');
      return;
    }
    if (!RegExp(r'^\S+@\S+\.\S+$').hasMatch(mail)) {
      setState(() => error = 'أدخل بريدًا إلكترونيًا صحيحًا.');
      return;
    }
    if (pass.length < 8) {
      setState(() => error = 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.');
      return;
    }
    if (pass != confirmation) {
      setState(() => error = 'كلمتا المرور غير متطابقتين.');
      return;
    }

    setState(() {
      loading = true;
      error = '';
    });

    try {
      final data = await ApiClient().post('/api/auth/signup', {
        'username': user,
        'email': mail,
        'password': pass,
      });

      final accessToken = data['access_token'];
      final refreshToken = data['refresh_token'];

      if (accessToken is String && accessToken.isNotEmpty) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('access_token', accessToken);
        if (refreshToken is String && refreshToken.isNotEmpty) {
          await prefs.setString('refresh_token', refreshToken);
        }

        if (!mounted) return;
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
          (_) => false,
        );
      } else if (mounted) {
        await showDialog<void>(
          context: context,
          builder: (_) => AlertDialog(
            title: const Text('تم إنشاء الحساب'),
            content: const Text(
              'تم إنشاء حسابك. إذا كان تفعيل البريد الإلكتروني مطلوبًا، افتح رابط التفعيل الذي وصلك ثم ارجع لتسجيل الدخول.',
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                  Navigator.pop(context);
                },
                child: const Text('العودة لتسجيل الدخول'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => error = e.toString().replaceFirst('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AuthScaffold(
      child: Column(
        children: [
          const BrandMark(),
          const SizedBox(height: 18),
          const Text(
            'إنشاء حساب جديد',
            style: TextStyle(fontSize: 30, fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 7),
          const Text(
            'انضم إلى مجتمع WarHex',
            style: TextStyle(color: Color(0xff9aa5bd)),
          ),
          const SizedBox(height: 24),
          TextField(
            controller: username,
            textInputAction: TextInputAction.next,
            decoration: authField('اسم المستخدم', Icons.person_outline),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: email,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            decoration: authField('البريد الإلكتروني', Icons.email_outlined),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: password,
            obscureText: obscure,
            textInputAction: TextInputAction.next,
            decoration: authField('كلمة المرور', Icons.lock_outline).copyWith(
              suffixIcon: IconButton(
                onPressed: () => setState(() => obscure = !obscure),
                icon: Icon(
                  obscure ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: confirm,
            obscureText: obscure,
            decoration: authField('تأكيد كلمة المرور', Icons.lock_reset_outlined),
          ),
          if (error.isNotEmpty) ...[
            const SizedBox(height: 14),
            Text(
              error,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xffff9b9b)),
            ),
          ],
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: FilledButton(
              onPressed: loading ? null : signup,
              child: loading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text(
                      'إنشاء الحساب',
                      style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
                    ),
            ),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: loading ? null : () => Navigator.pop(context),
            child: const Text('لدي حساب بالفعل — تسجيل الدخول'),
          ),
        ],
      ),
    );
  }
}

class AuthScaffold extends StatelessWidget {
  final Widget child;
  const AuthScaffold({required this.child, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xff172d70), Color(0xff35104f), Color(0xff080914)],
          ),
        ),
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 450),
              padding: const EdgeInsets.all(25),
              decoration: BoxDecoration(
                color: const Color(0xee11162a),
                borderRadius: BorderRadius.circular(30),
                border: Border.all(color: Colors.white12),
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}

class BrandMark extends StatelessWidget {
  const BrandMark({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 82,
      height: 82,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [Color(0xff2563eb), Color(0xff9333ea)],
        ),
      ),
      child: const Center(
        child: Text(
          'WH',
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.w900),
        ),
      ),
    );
  }
}

InputDecoration authField(String label, IconData icon) {
  return InputDecoration(
    labelText: label,
    prefixIcon: Icon(icon),
    filled: true,
    fillColor: Colors.white.withOpacity(.04),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(16),
      borderSide: BorderSide.none,
    ),
  );
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('WarHex')),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(18),
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        children: const [
          GameCard('♟', 'شطرنج'),
          GameCard('🎲', 'لودو'),
          GameCard('🀄', 'دومينو'),
          GameCard('🏆', 'البطولات'),
        ],
      ),
    );
  }
}

class GameCard extends StatelessWidget {
  final String icon;
  final String title;
  const GameCard(this.icon, this.title, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22),
        gradient: const LinearGradient(
          colors: [Color(0xff172554), Color(0xff3b1766)],
        ),
        border: Border.all(color: Colors.white12),
      ),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(icon, style: const TextStyle(fontSize: 44)),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800),
            ),
          ],
        ),
      ),
    );
  }
}
